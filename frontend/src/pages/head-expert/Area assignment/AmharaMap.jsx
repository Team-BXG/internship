import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Approximate coordinate centers for zones in Amhara region
const zoneCoordinates = {
  "North Gondar": [12.6000, 37.4600],
  "East Gojam": [10.3300, 37.7300],
  "South Wollo": [11.1300, 39.6300],
  "Awi": [10.6600, 36.5600],
  "Wag Hemra": [12.6300, 38.6400],
  "West Gojam": [10.9700, 37.4300],
  "Oromia Zone": [10.8700, 40.0300],
  "North Wollo": [11.9000, 39.3000],
  "South Gondar": [11.7000, 38.0000],
  "North Shewa": [9.8000, 39.4000]
};

// Amhara Region Center (Bahir Dar area)
const defaultCenter = [11.5936, 37.3908];

// Helper to generate a reliable scatter offset based purely on the assignment ID.
// This ensures that pins scatter randomly, but stay PERMANENTLY in their exact spot without jumping around.
function getStableOffset(seed) {
  // A simple seeded random number generator
  const x = Math.sin(seed * 12.9898 + 1) * 43758.5453;
  const y = Math.sin(seed * 78.233 + 2) * 43758.5453;

  // Convert to scatter offsets between -0.4 and +0.4 degrees (~44km spread)
  const latOffset = (x - Math.floor(x) - 0.5) * 0.8;
  const lngOffset = (y - Math.floor(y) - 0.5) * 0.8;

  return [latOffset, lngOffset];
}

export default function AmharaMap({ assignments }) {
  return (
    <div className="w-full rounded-[16px] overflow-hidden border border-blue-400/20 shadow-inner" style={{ height: '500px', minHeight: '500px' }}>
      <MapContainer
        center={defaultCenter}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: '500px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {assignments && assignments.map((assignment, index) => {
          const baseCoords = zoneCoordinates[assignment.zone_name];
          if (!baseCoords) return null; // If we don't know the zone coords, skip

          // Using a stable pseudo-random offset based on the unique assignment ID.
          // This scatters them so they NEVER overlap, but permanently anchors them so they NEVER move!
          const seed = parseInt(assignment.id) || index + 1;
          const [latOffset, lngOffset] = getStableOffset(seed);

          const position = [
            baseCoords[0] + latOffset,
            baseCoords[1] + lngOffset
          ];

          return (
            <Marker key={assignment.id || index} position={position} icon={redIcon}>
              <Tooltip direction="top" offset={[0, -30]} opacity={1}>
                <div className="text-sm min-w-[150px]">
                  <strong className="block text-red-600 text-base mb-2 border-b pb-1">
                    {assignment.supplier_name}
                  </strong>
                  <div className="text-slate-700 flex flex-col gap-1">
                    <div><span className="font-semibold text-slate-500">Zone:</span> {assignment.zone_name}</div>
                    <div><span className="font-semibold text-slate-500">Woreda:</span> {assignment.woreda_name}</div>
                    <div><span className="font-semibold text-slate-500">Kebele:</span> {assignment.kebele}</div>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

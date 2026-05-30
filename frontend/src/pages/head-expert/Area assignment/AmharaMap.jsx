import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Info, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

// Reset Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Setup premium multi-colored marker icons for equipment status
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
const iconSize = [25, 41];
const iconAnchor = [12, 41];
const popupAnchor = [1, -34];
const shadowSize = [41, 41];

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl, iconSize, iconAnchor, popupAnchor, shadowSize
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl, iconSize, iconAnchor, popupAnchor, shadowSize
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl, iconSize, iconAnchor, popupAnchor, shadowSize
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl, iconSize, iconAnchor, popupAnchor, shadowSize
});

function getMarkerIcon(problemUrgency) {
  if (!problemUrgency) return greenIcon;
  const urgency = problemUrgency.toLowerCase();
  if (urgency === 'high' || urgency === 'critical') return redIcon;
  if (urgency === 'medium') return orangeIcon;
  return yellowIcon;
}

// Custom DivIcon for cluster/representative badges (zoomed out mode)
const createClusterIcon = (count, highestUrgency) => {
  let colorClass = 'bg-emerald-500 border-emerald-200 text-white hover:bg-emerald-600';
  if (highestUrgency === 'High' || highestUrgency === 'Critical') {
    colorClass = 'bg-rose-500 border-rose-200 text-white animate-pulse hover:bg-rose-600';
  } else if (highestUrgency === 'Medium') {
    colorClass = 'bg-amber-500 border-amber-200 text-white hover:bg-amber-600';
  } else if (highestUrgency === 'Low') {
    colorClass = 'bg-yellow-400 border-yellow-200 text-slate-800 hover:bg-yellow-500';
  }

  return L.divIcon({
    html: `<div class="flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 font-black text-[13px] transition-all duration-300 transform hover:scale-110 ${colorClass}">
             <span>${count}</span>
           </div>`,
    className: 'custom-cluster-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

// Stable offset to scatter pins in the same woreda coordinate slightly so they don't block each other
function getStableOffset(id) {
  const seed = parseInt(id) || 1;
  const x = Math.sin(seed * 12.9898) * 0.007; // ~700m spread max
  const y = Math.cos(seed * 78.233) * 0.007;
  return [x, y];
}

// Zoom listener component
function ZoomListener({ onChangeZoom }) {
  useMapEvents({
    zoomend: (e) => {
      onChangeZoom(e.target.getZoom());
    }
  });
  return null;
}

const defaultCenter = [11.5936, 37.3908]; // Centered on Bahir Dar / Amhara Region

export default function AmharaMap({ beneficiaries, onSelectBeneficiary }) {
  const [zoom, setZoom] = useState(7);

  // Group beneficiaries for clustering when zoomed out (zoom < 9)
  const renderClusteredMarkers = () => {
    // Group by woreda_id
    const groups = {};
    beneficiaries.forEach(b => {
      if (!b.woreda_id || b.latitude === null || b.longitude === null) return;
      if (!groups[b.woreda_id]) {
        groups[b.woreda_id] = {
          woredaName: b.woreda_name,
          zoneName: b.zone_name,
          latitude: b.latitude,
          longitude: b.longitude,
          items: []
        };
      }
      groups[b.woreda_id].items.push(b);
    });

    return Object.values(groups).map((group, idx) => {
      const count = group.items.length;
      
      // Determine highest urgency problem in this woreda group
      let highestUrgency = null;
      group.items.forEach(item => {
        if (!item.problem_urgency) return;
        const urg = item.problem_urgency;
        if (urg === 'High' || urg === 'Critical') highestUrgency = 'High';
        else if (urg === 'Medium' && highestUrgency !== 'High') highestUrgency = 'Medium';
        else if (urg === 'Low' && !highestUrgency) highestUrgency = 'Low';
      });

      const position = [group.latitude, group.longitude];
      const clusterIcon = createClusterIcon(count, highestUrgency);

      return (
        <Marker 
          key={`woreda-cluster-${idx}`} 
          position={position} 
          icon={clusterIcon}
          eventHandlers={{
            click: () => {
              // Select the first beneficiary in the cluster as representative details
              if (onSelectBeneficiary && group.items.length > 0) {
                onSelectBeneficiary(group.items[0], group.items);
              }
            }
          }}
        >
          <Tooltip direction="top" offset={[0, -20]} opacity={1}>
            <div className="p-1 min-w-[140px] text-xs">
              <strong className="block text-slate-800 text-[13px] font-bold border-b pb-1 mb-1">
                {group.woredaName} Woreda
              </strong>
              <div className="text-slate-500 font-semibold mb-1">{group.zoneName}</div>
              <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                <Info size={12} />
                <span>{count} Equipment Systems</span>
              </div>
            </div>
          </Tooltip>
        </Marker>
      );
    });
  };

  // Render individual markers when zoomed in (zoom >= 9)
  const renderIndividualMarkers = () => {
    return beneficiaries.map((b, index) => {
      if (b.latitude === null || b.longitude === null) return null;

      // Apply microscopic stable offset so overlapping coordinates spread out beautifully
      const [latOffset, lngOffset] = getStableOffset(b.id || index + 1);
      const position = [b.latitude + latOffset, b.longitude + lngOffset];
      const icon = getMarkerIcon(b.problem_urgency);

      return (
        <Marker 
          key={`beneficiary-${b.id || index}`} 
          position={position} 
          icon={icon}
          eventHandlers={{
            click: () => {
              if (onSelectBeneficiary) {
                onSelectBeneficiary(b, null);
              }
            }
          }}
        >
          <Tooltip direction="top" offset={[0, -30]} opacity={1}>
            <div className="text-xs min-w-[160px]">
              <strong className="block text-slate-800 text-[13px] font-bold border-b pb-1 mb-1 flex items-center justify-between">
                <span>{b.full_name}</span>
                {b.problem_urgency && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-white ${
                    b.problem_urgency.toLowerCase() === 'high' || b.problem_urgency.toLowerCase() === 'critical' ? 'bg-red-500' :
                    b.problem_urgency.toLowerCase() === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}>
                    {b.problem_urgency} Issue
                  </span>
                )}
              </strong>
              <div className="text-slate-600 flex flex-col gap-0.5 font-medium">
                <div><span className="text-slate-400 font-semibold">Equipment:</span> {b.equipment_type}</div>
                <div><span className="text-slate-400 font-semibold">Zone:</span> {b.zone_name}</div>
                <div><span className="text-slate-400 font-semibold">Woreda:</span> {b.woreda_name}</div>
                <div><span className="text-slate-400 font-semibold">Kebele:</span> {b.kebele || 'N/A'}</div>
              </div>
            </div>
          </Tooltip>
        </Marker>
      );
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Interactive Map */}
      <div className="w-full rounded-[24px] overflow-hidden border border-slate-200 shadow-md relative z-10" style={{ height: '550px' }}>
        <MapContainer
          center={defaultCenter}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomListener onChangeZoom={setZoom} />

          {zoom < 9 ? renderClusteredMarkers() : renderIndividualMarkers()}
        </MapContainer>
      </div>

      {/* Premium Visual Legend */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 mt-2 shadow-inner">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-blue-500 stroke-[2.5]" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Map Mode: {zoom < 9 ? 'Representative Clusters (Zoom In for details)' : 'Individual Systems'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <span className="text-xs font-bold text-slate-700">Healthy / Functional (Default Green)</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-500" />
            <span className="text-xs font-bold text-slate-700">Low Urgency Problem (Yellow)</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            <span className="text-xs font-bold text-slate-700">Medium Urgency Problem (Orange)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500 stroke-[2.5] animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Critical / High Severity Problem (Red)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

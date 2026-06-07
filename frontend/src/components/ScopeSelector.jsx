import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const ScopeSelector = ({ title, subtitle, requireWoreda = false, onConfirm }) => {
  const [zoneList, setZoneList] = useState([]);
  const [woredaList, setWoredaList] = useState([]);
  const [zone, setZone] = useState("");
  const [woreda, setWoreda] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/zones")
      .then(res => res.json())
      .then(data => setZoneList(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!zone) {
      setWoredaList([]);
      return;
    }
    const matchedZone = zoneList.find(z => z.name === zone);
    if (matchedZone) {
      fetch(`http://localhost:8000/api/zones/${matchedZone.id}/woredas`)
        .then(res => res.json())
        .then(data => setWoredaList(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [zone, zoneList]);

  const canContinue = requireWoreda ? zone && woreda : zone;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500 text-base mt-2">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-3xl p-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Zone Selection</label>
            <select
              className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={zone}
              onChange={(e) => {
                setZone(e.target.value);
                setWoreda("");
              }}
            >
              <option value="">Select zone...</option>
              {zoneList.map((z) => (
                <option key={z.id} value={z.name}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          {requireWoreda && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Woreda Selection</label>
              <select
                className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
                disabled={!zone}
              >
                <option value="">{zone ? "Select woreda..." : "Select zone first"}</option>
                {woredaList.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => onConfirm({ zone, woreda })}
            disabled={!canContinue}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              canContinue
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScopeSelector;

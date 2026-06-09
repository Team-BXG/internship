import { useState, useEffect, useMemo } from 'react';
import { MapPin, Info, User, Phone, CheckCircle, Layers, Calendar } from 'lucide-react';
import AmharaMap from './AmharaMap';

const LEVEL_FUNCTIONAL = 'Functional';
const LEVEL_PARTIAL = 'Partially functional but in need of repair';
const LEVEL_NOT_FUNCTIONAL = 'Not functional';
const LEVEL_ABANDONED = 'Abandoned or no longer exists';

function classifyLevel(level) {
  if (!level) return 'functional';
  if (level === LEVEL_FUNCTIONAL) return 'functional';
  if (level.includes('Partially')) return 'partial';
  if (level.includes('Not functional')) return 'not_functional';
  if (level.includes('Abandoned')) return 'abandoned';
  return 'functional';
}

export default function AreaAssignment() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [clusterList, setClusterList] = useState([]);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/beneficiaries?approved_only=true');
      const data = await res.json();
      const approvedOnly = (data || []).filter(b => b.status === 'Approved' || b.status === 'Assigned');
      setBeneficiaries(approvedOnly);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching beneficiaries:", err);
      setLoading(false);
    }
  };

  const levelCounts = useMemo(() => {
    const counts = { functional: 0, partial: 0, not_functional: 0, abandoned: 0 };
    beneficiaries.forEach(b => {
      const key = classifyLevel(b.problem_level || b.problem_urgency);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [beneficiaries]);

  const handleSelectBeneficiary = (beneficiary, clusterItems) => {
    setSelectedBeneficiary(beneficiary);
    setClusterList(clusterItems || []);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400 font-bold p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <span>Loading Equipment Distribution Data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <MapPin className="text-blue-600 stroke-[2.5] w-8 h-8" />
            Equipment Distribution Map
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Monitor system locations by operational status across Amhara woredas.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <CheckCircle size={16} className="stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Functional</span>
              <span className="text-sm font-black">{levelCounts.functional}</span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 text-amber-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <Info size={16} className="stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Partially Functional</span>
              <span className="text-sm font-black">{levelCounts.partial}</span>
            </div>
          </div>
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <Info size={16} className="stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">Not Functional</span>
              <span className="text-sm font-black">{levelCounts.not_functional}</span>
            </div>
          </div>
          <div className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <Info size={16} className="stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Abandoned / No Longer Exists</span>
              <span className="text-sm font-black">{levelCounts.abandoned}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
        <div className="flex-1 min-w-[300px]">
          <AmharaMap
            beneficiaries={beneficiaries}
            onSelectBeneficiary={handleSelectBeneficiary}
          />
        </div>

        <div className="w-full xl:w-[420px] shrink-0 bg-white border border-slate-200 rounded-[28px] p-6 shadow-md flex flex-col min-h-[600px]">
          {!selectedBeneficiary ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 rounded-[24px] bg-slate-50 flex items-center justify-center text-blue-500 mb-6 shadow-inner">
                <Layers size={40} className="stroke-[2]" />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">Explore Deployments</h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-[280px]">
                Click on any cluster count badge or individual equipment pin to view detailed operational specifications and recipient details.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 flex-1 h-full">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800">{selectedBeneficiary.full_name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{selectedBeneficiary.equipment_type} • {selectedBeneficiary.woreda}</p>
                </div>
                <button onClick={() => setSelectedBeneficiary(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">Close</button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600"><User size={16} /><span>{selectedBeneficiary.supplier || 'No supplier'}</span></div>
                <div className="flex items-center gap-2 text-slate-600"><Phone size={16} /><span>{selectedBeneficiary.phone || 'No phone'}</span></div>
                <div className="flex items-center gap-2 text-slate-600"><Calendar size={16} /><span>{new Date(selectedBeneficiary.created_at).toLocaleDateString()}</span></div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">System Status</span>
                  <p className="font-bold text-slate-800 mt-1">{selectedBeneficiary.problem_level || LEVEL_FUNCTIONAL}</p>
                </div>
              </div>

              {clusterList.length > 1 && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Cluster ({clusterList.length})</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {clusterList.map(b => (
                      <button key={b.id} onClick={() => setSelectedBeneficiary(b)} className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700">
                        {b.full_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

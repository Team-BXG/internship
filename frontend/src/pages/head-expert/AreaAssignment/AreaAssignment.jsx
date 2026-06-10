import { useState, useEffect, useMemo } from 'react';
import { MapPin, Info, User, Phone, CheckCircle, ShieldAlert, AlertTriangle, Layers, Calendar } from 'lucide-react';
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

function getLevelLabel(level) {
  if (!level || level === LEVEL_FUNCTIONAL) return 'System Fully Operational';
  if (level.includes('Partially')) return 'Partially Functional';
  if (level.includes('Not functional')) return 'Not Functional';
  if (level.includes('Abandoned')) return 'Abandoned / No Longer Exists';
  return 'System Fully Operational';
}

function getLevelBadgeClass(level) {
  const key = classifyLevel(level);
  if (key === 'not_functional') return 'bg-rose-100 text-rose-700 border border-rose-200';
  if (key === 'abandoned') return 'bg-orange-100 text-orange-700 border border-orange-200';
  if (key === 'partial') return 'bg-amber-100 text-amber-700 border border-amber-200';
  return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
}

function getLevelDotClass(level) {
  const key = classifyLevel(level);
  if (key === 'not_functional') return 'bg-rose-500';
  if (key === 'abandoned') return 'bg-orange-500';
  if (key === 'partial') return 'bg-amber-500';
  return 'bg-emerald-500';
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
      const approvedOnly = (data || []).filter(b => b.status === 'Approved');
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

  const selectedLevel = selectedBeneficiary?.problem_level || selectedBeneficiary?.problem_urgency;

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
            Monitor woreda-approved system locations and operational status across Amhara woredas.
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
            <AlertTriangle size={16} className="stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Partially Functional</span>
              <span className="text-sm font-black">{levelCounts.partial}</span>
            </div>
          </div>
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <ShieldAlert size={16} className="stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">Not Functional</span>
              <span className="text-sm font-black">{levelCounts.not_functional}</span>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 text-orange-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <Info size={16} className="stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-500">Abandoned</span>
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
                Click on any cluster count badge or individual equipment pin to view detailed operational specifications, system status, and recipient details.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 flex-1 h-full">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getLevelBadgeClass(selectedLevel)}`}>
                    {getLevelLabel(selectedLevel)}
                  </span>

                  {clusterList.length > 1 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 font-extrabold uppercase px-2 py-0.5 rounded-md">
                      Cluster View ({clusterList.length})
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-1">
                  {selectedBeneficiary.full_name}
                </h2>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1.5">
                  <MapPin size={14} className="text-blue-500 stroke-[2.5]" />
                  <span>{selectedBeneficiary.woreda_name || selectedBeneficiary.woreda} Woreda, {selectedBeneficiary.zone_name || selectedBeneficiary.zone}</span>
                </div>
              </div>

              {clusterList.length > 1 && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col gap-2 max-h-[150px] overflow-y-auto shadow-inner">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
                    Systems in this Woreda Centroid
                  </div>
                  <div className="flex flex-col gap-1">
                    {clusterList.map(item => {
                      const itemLevel = item.problem_level || item.problem_urgency;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedBeneficiary(item)}
                          className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                            selectedBeneficiary.id === item.id
                              ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                              : 'bg-white border-slate-100 hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span className="truncate max-w-[150px]">{item.full_name}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] uppercase tracking-wider opacity-90">{item.equipment_type}</span>
                            {classifyLevel(itemLevel) !== 'functional' && (
                              <span className={`w-2 h-2 rounded-full ${getLevelDotClass(itemLevel)}`}></span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 flex-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                  Recipient Profile & System Parameters
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Equipment Type</div>
                    <div className="text-xs font-black text-slate-800 truncate">{selectedBeneficiary.equipment_type}</div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Supplier / Contractor</div>
                    <div className="text-xs font-black text-slate-800 truncate">{selectedBeneficiary.supplier || 'Not Assigned'}</div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">National ID</div>
                    <div className="text-xs font-black text-slate-800">{selectedBeneficiary.national_id || 'N/A'}</div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Contact Phone</div>
                    <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                      <Phone size={10} className="text-slate-400" />
                      <span>{selectedBeneficiary.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Gender / Household</div>
                    <div className="text-xs font-black text-slate-800">
                      {selectedBeneficiary.gender || 'N/A'} ({selectedBeneficiary.household_size || 'N/A'} pers)
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-inner">
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Kebele / Village</div>
                    <div className="text-xs font-black text-slate-800 truncate">
                      K. {selectedBeneficiary.kebele || 'N/A'} / V. {selectedBeneficiary.village || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 mt-auto">
                  <Calendar size={18} className="text-blue-500 stroke-[2.5]" />
                  <div className="flex flex-col gap-1">
                    <div className="text-[9px] font-extrabold text-blue-500 uppercase tracking-widest leading-none">
                      Registration Details
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                      Woreda-approved registration via {selectedBeneficiary.survey_type || 'Direct'} on{' '}
                      {selectedBeneficiary.created_at
                        ? new Date(selectedBeneficiary.created_at).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })
                        : 'Unknown Date'}
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

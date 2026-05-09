import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, Clock, User, MapPin, Zap, 
  MessageSquare, Send, Search, Filter, ChevronDown, Eye
} from 'lucide-react';

const ReviewDemands = ({ selectedScope }) => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentComment, setAdjustmentComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending Woreda Review');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchDemands();
  }, [selectedScope, statusFilter]);

  const fetchDemands = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/demands?status=${statusFilter}&zone=${selectedScope.zone}&woreda=${selectedScope.woreda}`);
      if (res.ok) {
        const data = await res.json();
        setDemands(data);
      }
    } catch (error) {
      console.error('Error fetching demands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (demandId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/demands/${demandId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved for Zone Review' })
      });
      
      if (res.ok) {
        alert("Demand approved and sent to Zone Approver");
        fetchDemands();
      }
    } catch (error) {
      console.error('Error approving demand:', error);
      alert("Error approving demand");
    }
  };

  const handleRequestAdjustment = async () => {
    if (!adjustmentComment.trim()) {
      alert("Please provide adjustment comments");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/demands/${selectedDemand.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'Needs Adjustment',
          comment: adjustmentComment 
        })
      });
      
      if (res.ok) {
        alert("Adjustment request sent to encoder");
        setShowAdjustModal(false);
        setAdjustmentComment('');
        setSelectedDemand(null);
        fetchDemands();
      }
    } catch (error) {
      console.error('Error requesting adjustment:', error);
      alert("Error requesting adjustment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Woreda Review': return 'bg-amber-100 text-amber-800';
      case 'Approved for Zone Review': return 'bg-emerald-100 text-emerald-800';
      case 'Needs Adjustment': return 'bg-red-100 text-red-800';
      case 'Zone Approved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending Woreda Review': return <Clock className="w-4 h-4" />;
      case 'Approved for Zone Review': return <CheckCircle2 className="w-4 h-4" />;
      case 'Needs Adjustment': return <AlertTriangle className="w-4 h-4" />;
      case 'Zone Approved': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredDemands = demands.filter(demand =>
    demand.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demand.national_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demand.village?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Review Demands</h3>
          <p className="text-slate-500">Review and approve solar equipment demand requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or village..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <select
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Pending Woreda Review">Pending Review</option>
            <option value="Approved for Zone Review">Approved</option>
            <option value="Needs Adjustment">Needs Adjustment</option>
            <option value="">All Status</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">
                {demands.filter(d => d.status === 'Pending Woreda Review').length}
              </p>
              <p className="text-xs text-amber-600">Pending Review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">
                {demands.filter(d => d.status === 'Approved for Zone Review').length}
              </p>
              <p className="text-xs text-emerald-600">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-900">
                {demands.filter(d => d.status === 'Needs Adjustment').length}
              </p>
              <p className="text-xs text-red-600">Needs Adjustment</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{demands.length}</p>
              <p className="text-xs text-blue-600">Total Demands</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demands List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-semibold text-slate-800">Demand Requests</h4>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading demands...</div>
        ) : filteredDemands.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No demands found</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDemands.map((demand) => (
              <div key={demand.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{demand.full_name}</div>
                      <div className="text-sm text-slate-500">
                        ID: {demand.national_id} • Phone: {demand.phone}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3" />
                        {demand.village}, {demand.kebele}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <Zap className="w-3 h-3" />
                        {demand.solar_panel_type} • {demand.watt_level}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(demand.status)}`}>
                      {getStatusIcon(demand.status)}
                      {demand.status}
                    </span>
                    
                    <button
                      onClick={() => {
                        setSelectedDemand(demand);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {demand.status === 'Pending Woreda Review' && (
                      <>
                        <button
                          onClick={() => handleApprove(demand.id)}
                          className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedDemand(demand);
                            setShowAdjustModal(true);
                          }}
                          className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Request Adjustment
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDemand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-slate-800">Demand Details</h4>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Full Name</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.full_name}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">National ID</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.national_id}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Phone Number</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(selectedDemand.status)}`}>
                    {getStatusIcon(selectedDemand.status)}
                    {selectedDemand.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Zone</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.zone}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Woreda</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.woreda}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Kebele</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.kebele}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Village</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.village}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Solar Panel Type</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.solar_panel_type}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Watt Level</label>
                  <p className="font-semibold text-slate-800">{selectedDemand.watt_level}</p>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-slate-500 block mb-1">Submitted Date</label>
                <p className="font-semibold text-slate-800">
                  {new Date(selectedDemand.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {showAdjustModal && selectedDemand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-slate-800">Request Adjustment</h4>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">
                Request adjustment for: <span className="font-semibold">{selectedDemand.full_name}</span>
              </p>
              <p className="text-sm text-slate-500">
                Please specify what needs to be adjusted in the demand request.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Adjustment Comments *
                </label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Describe what needs to be adjusted..."
                  value={adjustmentComment}
                  onChange={(e) => setAdjustmentComment(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRequestAdjustment}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Adjustment Request
                </button>
                <button
                  onClick={() => {
                    setShowAdjustModal(false);
                    setAdjustmentComment('');
                    setSelectedDemand(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDemands;

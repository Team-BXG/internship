import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, 
  RefreshCw, Eye, MessageSquare, Clock, User
} from 'lucide-react';

const ChangeStatus = ({ selectedScope }) => {
  const [activeTab, setActiveTab] = useState('demands');
  const [submissions, setSubmissions] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const [demandsRes, benRes] = await Promise.all([
        fetch(`http://localhost:8000/api/demands?zone=${selectedScope.zone}&woreda=${selectedScope.woreda}`),
        fetch(`http://localhost:8000/api/beneficiaries?zone=${selectedScope.zone}&woreda=${selectedScope.woreda}`)
      ]);
      
      if (demandsRes.ok) {
        const dData = await demandsRes.json();
        setSubmissions(Array.isArray(dData) ? dData : []);
      }
      if (benRes.ok) {
        const bData = await benRes.json();
        setBeneficiaries(Array.isArray(bData) ? bData : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setEditData(submission);
    setShowDetailsModal(true);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      const endpoint = activeTab === 'demands' 
        ? `http://localhost:8000/api/demands/${selectedSubmission.id}`
        : `http://localhost:8000/api/beneficiaries/${selectedSubmission.id}`;
        
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        alert('Submission updated successfully!');
        setShowDetailsModal(false);
        setEditMode(false);
        fetchSubmissions();
      } else {
        alert('Failed to update submission');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Error updating submission');
    }
  };

  const handleResubmit = async () => {
    try {
      const endpoint = activeTab === 'demands'
        ? `http://localhost:8000/api/demands/${selectedSubmission.id}/status`
        : `http://localhost:8000/api/beneficiaries/${selectedSubmission.id}/status`;
        
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Pending Woreda Review'
        })
      });

      if (response.ok) {
        alert('Resubmitted successfully!');
        setShowDetailsModal(false);
        fetchSubmissions();
      } else {
        alert('Failed to resubmit');
      }
    } catch (error) {
      console.error('Error resubmitting:', error);
      alert('Error resubmitting');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Woreda Review':
      case 'Pending Woreda': return 'bg-amber-100 text-amber-800';
      case 'Needs Adjustment': 
      case 'Adjustment Needed': return 'bg-red-100 text-red-800';
      case 'Rejected': return 'bg-rose-100 text-rose-800 border border-rose-200';
      case 'Approved for Zone Review': 
      case 'Pending Zone': return 'bg-emerald-100 text-emerald-800';
      case 'Zone Approved': 
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Assigned to Supplier': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending Woreda Review':
      case 'Pending Woreda': return <Clock className="w-4 h-4" />;
      case 'Needs Adjustment': 
      case 'Adjustment Needed': return <AlertTriangle className="w-4 h-4" />;
      case 'Rejected': return <AlertTriangle className="w-4 h-4" />;
      case 'Approved for Zone Review': 
      case 'Pending Zone': return <CheckCircle2 className="w-4 h-4" />;
      case 'Zone Approved': 
      case 'Approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'Assigned to Supplier': return <User className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Change Status</h3>
          <p className="text-slate-500">Manage your demand submissions and responses from approvers</p>
        </div>
        <button 
          onClick={fetchSubmissions}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-4">
            <button 
              className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'demands' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
              onClick={() => setActiveTab('demands')}
            >
              Demands ({submissions.length})
            </button>
            <button 
              className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'beneficiaries' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
              onClick={() => setActiveTab('beneficiaries')}
            >
              Beneficiaries ({beneficiaries.length})
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {(activeTab === 'demands' ? submissions : beneficiaries).length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Submissions Found</h3>
              <p className="text-slate-500">You haven't submitted any demands yet.</p>
            </div>
          ) : (
            (activeTab === 'demands' ? submissions : beneficiaries).map((submission, index) => (
              <div key={submission.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{submission.full_name}</h4>
                        <p className="text-sm text-slate-600">{submission.zone} - {submission.woreda}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Equipment:</span> {submission.solar_panel_type}
                      </div>
                      <div>
                        <span className="font-medium">Watt Level:</span> {submission.watt_level}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span> {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {submission.phone}
                      </div>
                    </div>

                    {['Needs Adjustment', 'Adjustment Needed', 'Rejected'].includes(submission.status) && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm font-medium text-amber-800 mb-1">Feedback/Adjustment Required:</p>
                        <p className="text-sm text-slate-700">
                          {JSON.parse(submission.details_json || '{}').adjustment_comments || 'Please review and make necessary adjustments.'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => handleViewDetails(submission)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Submission Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editMode ? editData.full_name : selectedSubmission.full_name}
                    onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editMode ? editData.phone : selectedSubmission.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    disabled={!editMode}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Equipment Type</label>
                  <select 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editMode ? editData.solar_panel_type : selectedSubmission.solar_panel_type}
                    onChange={(e) => setEditData({...editData, solar_panel_type: e.target.value})}
                    disabled={!editMode}
                  >
                    <option value="Home Solar System">Home Solar System</option>
                    <option value="Solar Lantern">Solar Lantern</option>
                    <option value="Solar Water Pump">Solar Water Pump</option>
                    <option value="Solar Street Light">Solar Street Light</option>
                    <option value="Solar Refrigerator">Solar Refrigerator</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Watt Level</label>
                  <select 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editMode ? editData.watt_level : selectedSubmission.watt_level}
                    onChange={(e) => setEditData({...editData, watt_level: e.target.value})}
                    disabled={!editMode}
                  >
                    <option value="10W">10W - Small Lantern</option>
                    <option value="20W">20W - Medium Lantern</option>
                    <option value="50W">50W - Home System Basic</option>
                    <option value="100W">100W - Home System Standard</option>
                    <option value="200W">200W - Home System Premium</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Zone</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editMode ? editData.zone : selectedSubmission.zone}
                    onChange={(e) => setEditData({...editData, zone: e.target.value})}
                    disabled={!editMode}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Woreda</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editMode ? editData.woreda : selectedSubmission.woreda}
                    onChange={(e) => setEditData({...editData, woreda: e.target.value})}
                    disabled={!editMode}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Kebele</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editMode ? editData.kebele : selectedSubmission.kebele}
                    onChange={(e) => setEditData({...editData, kebele: e.target.value})}
                    disabled={!editMode}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Village</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editMode ? editData.village : selectedSubmission.village}
                    onChange={(e) => setEditData({...editData, village: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              {editMode ? (
                <>
                  <button 
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  {['Needs Adjustment', 'Adjustment Needed', 'Rejected'].includes(selectedSubmission.status) && (
                    <button 
                      onClick={handleEdit}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Edit & Resubmit
                    </button>
                  )}
                  <button 
                    onClick={handleResubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Resubmit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeStatus;

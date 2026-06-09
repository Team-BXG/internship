import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Zap, Globe, MapPin, TrendingUp, RefreshCw } from 'lucide-react';

const DemandStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchStatistics();
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/demands/statistics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatistics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics');
      // Use fallback data
      setStatistics([
        { zone: 'North Gondar', woreda: 'Debark', solar_panel_type: 'Solar Water Pump', watt_level: '50W', status: 'Approved for Zone Review', count: 1 },
        { zone: 'South Gondar', woreda: 'Bahir Dar', solar_panel_type: 'Home Solar System', watt_level: '100W', status: 'Pending Woreda Review', count: 2 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDemands = () => {
    return statistics.reduce((sum, stat) => sum + stat.count, 0);
  };

  const getUniqueZones = () => {
    return [...new Set(statistics.map(stat => stat.zone).filter(Boolean))];
  };

  const getUniqueWoredas = () => {
    return [...new Set(statistics.map(stat => stat.woreda).filter(Boolean))];
  };

  const getDemandsByZone = () => {
    const zoneData = {};
    statistics.forEach(stat => {
      if (!zoneData[stat.zone]) {
        zoneData[stat.zone] = 0;
      }
      zoneData[stat.zone] += stat.count;
    });
    return Object.entries(zoneData).sort(([,a], [,b]) => b - a);
  };

  const assignSupplier = async () => {
    if (!selectedDemand || !selectedSupplier) {
      toast.error('Please select a demand and supplier');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/demands/${selectedDemand.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Assigned to Supplier',
          supplier_id: selectedSupplier
        })
      });

      if (response.ok) {
        toast.success('Supplier assigned successfully!');
        setShowAssignModal(false);
        setSelectedDemand(null);
        setSelectedSupplier('');
        fetchStatistics(); // Refresh data
      } else {
        toast.error('Failed to assign supplier');
      }
    } catch (error) {
      console.error('Error assigning supplier:', error);
      toast.error('Error assigning supplier');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading demand statistics...</p>
        </div>
      </div>
    );
  }

  if (error && statistics.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Unable to Load Data</h3>
          <p className="text-slate-500 mb-4">{error}</p>
          <button 
            onClick={fetchStatistics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Demand Statistics</h3>
          <p className="text-slate-500">Solar equipment demand overview across all regions</p>
        </div>
        <button 
          onClick={fetchStatistics}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Assign Supplier</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Selected Demand</label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-medium">{selectedDemand?.zone} - {selectedDemand?.woreda}</p>
                  <p className="text-sm text-slate-600">{selectedDemand?.solar_panel_type} ({selectedDemand?.watt_level})</p>
                  <p className="text-sm text-slate-600">Status: {selectedDemand?.status}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-slate-700">Select Supplier</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  <option value="">Choose a supplier...</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.service_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={assignSupplier}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Assign Supplier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{getTotalDemands()}</p>
              <p className="text-xs text-slate-600">Total Demands</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{getUniqueZones().length}</p>
              <p className="text-xs text-slate-600">Active Zones</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{getUniqueWoredas().length}</p>
              <p className="text-xs text-slate-600">Active Woredas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{statistics.length}</p>
              <p className="text-xs text-slate-600">Data Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Overview */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Regional Overview
          </h4>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {getDemandsByZone().map(([zone, count], index) => {
              const zoneWoredas = statistics.filter(stat => stat.zone === zone);
              return (
                <div key={zone} className="border border-slate-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-slate-800">{zone}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{count} demands</span>
                  </div>
                  <div className="ml-8 text-xs text-slate-600">
                    {zoneWoredas.map((stat, i) => (
                      <div key={i} className="flex justify-between py-1">
                        <span>• {stat.woreda}</span>
                        <span className="text-slate-500">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg mt-6">
        <div className="p-4 border-b border-slate-200">
          <h4 className="font-semibold text-slate-800">Detailed Data</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Zone</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Woreda</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Equipment Type</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Watt Level</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-right p-3 text-sm font-semibold text-slate-700">Count</th>
                <th className="text-center p-3 text-sm font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-sm text-slate-800">{stat.zone}</td>
                  <td className="p-3 text-sm text-slate-800">{stat.woreda}</td>
                  <td className="p-3 text-sm text-slate-800">{stat.solar_panel_type}</td>
                  <td className="p-3 text-sm text-slate-800">{stat.watt_level}</td>
                  <td className="p-3 text-sm text-slate-800">{stat.status}</td>
                  <td className="p-3 text-sm font-semibold text-slate-800 text-right">{stat.count}</td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => {
                        setSelectedDemand(stat);
                        setShowAssignModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Assign Supplier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DemandStatistics;

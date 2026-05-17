import React, { useState, useEffect } from 'react';
import { 
  Zap, MapPin, Users, TrendingUp, BarChart3, PieChart, 
  Filter, Search, ChevronDown, Download, Eye
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const DemandStatistics = ({ selectedZone }) => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [woredaFilter, setWoredaFilter] = useState('');
  const [solarTypeFilter, setSolarTypeFilter] = useState('');
  const [wattLevelFilter, setWattLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, [selectedZone]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/demands/statistics?zone=${selectedZone}`);
      if (res.ok) {
        const data = await res.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueWoredas = () => {
    const woredas = [...new Set(statistics.map(stat => stat.woreda))];
    return woredas.filter(w => w);
  };

  const getUniqueSolarTypes = () => {
    const types = [...new Set(statistics.map(stat => stat.solar_panel_type))];
    return types.filter(t => t);
  };

  const getUniqueWattLevels = () => {
    const levels = [...new Set(statistics.map(stat => stat.watt_level))];
    return levels.filter(l => l);
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(statistics.map(stat => stat.status))];
    return statuses.filter(s => s);
  };

  const filteredStatistics = statistics.filter(stat => {
    const matchesSearch = !searchTerm || 
      stat.woreda?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.solar_panel_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.watt_level?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWoreda = !woredaFilter || stat.woreda === woredaFilter;
    const matchesSolarType = !solarTypeFilter || stat.solar_panel_type === solarTypeFilter;
    const matchesWattLevel = !wattLevelFilter || stat.watt_level === wattLevelFilter;
    const matchesStatus = !statusFilter || stat.status === statusFilter;
    
    return matchesSearch && matchesWoreda && matchesSolarType && matchesWattLevel && matchesStatus;
  });

  const getTotalDemands = () => {
    return filteredStatistics.reduce((sum, stat) => sum + stat.count, 0);
  };

  const getDemandsByWoreda = () => {
    const woredaData = {};
    filteredStatistics.forEach(stat => {
      if (!woredaData[stat.woreda]) {
        woredaData[stat.woreda] = 0;
      }
      woredaData[stat.woreda] += stat.count;
    });
    return Object.entries(woredaData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getDemandsBySolarType = () => {
    const typeData = {};
    filteredStatistics.forEach(stat => {
      if (!typeData[stat.solar_panel_type]) {
        typeData[stat.solar_panel_type] = 0;
      }
      typeData[stat.solar_panel_type] += stat.count;
    });
    return Object.entries(typeData)
      .sort(([,a], [,b]) => b - a);
  };

  const getDemandsByWattLevel = () => {
    const wattData = {};
    filteredStatistics.forEach(stat => {
      if (!wattData[stat.watt_level]) {
        wattData[stat.watt_level] = 0;
      }
      wattData[stat.watt_level] += stat.count;
    });
    return Object.entries(wattData)
      .sort(([,a], [,b]) => b - a);
  };

  const getDemandsByStatus = () => {
    const statusData = {};
    filteredStatistics.forEach(stat => {
      if (!statusData[stat.status]) {
        statusData[stat.status] = 0;
      }
      statusData[stat.status] += stat.count;
    });
    return statusData;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading demand statistics...</div>
      </div>
    );
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text(`Demand Statistics Report - ${selectedZone}`, 14, 15)
    
    doc.setFontSize(10)
    doc.text(`Total Demands: ${getTotalDemands()}`, 14, 25)
    
    const tableColumn = ["Woreda", "Solar Type", "Watt Level", "Status", "Count"]
    const tableRows = []

    filteredStatistics.forEach(stat => {
      const statData = [
        stat.woreda,
        stat.solar_panel_type,
        stat.watt_level,
        stat.status,
        stat.count
      ]
      tableRows.push(statData)
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    })

    doc.save(`zone_demand_report_${new Date().toISOString().split('T')[0]}.pdf`)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Demand Statistics</h3>
          <p className="text-slate-500">Numerical view of solar equipment demands across {selectedZone}</p>
        </div>
        <button 
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{getTotalDemands()}</p>
              <p className="text-xs text-blue-600">Total Demands</p>
            </div>
          </div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">{getUniqueWoredas().length}</p>
              <p className="text-xs text-emerald-600">Active Woredas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">
                {getDemandsByStatus()['Approved for Zone Review'] || 0}
              </p>
              <p className="text-xs text-purple-600">Ready for Review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">{getUniqueSolarTypes().length}</p>
              <p className="text-xs text-amber-600">Solar Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search demands..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative min-w-[150px]">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <select
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={woredaFilter}
            onChange={(e) => setWoredaFilter(e.target.value)}
          >
            <option value="">All Woredas</option>
            {getUniqueWoredas().map(woreda => (
              <option key={woreda} value={woreda}>{woreda}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        
        <div className="relative min-w-[150px]">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <select
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={solarTypeFilter}
            onChange={(e) => setSolarTypeFilter(e.target.value)}
          >
            <option value="">All Solar Types</option>
            {getUniqueSolarTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        
        <div className="relative min-w-[150px]">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <select
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={wattLevelFilter}
            onChange={(e) => setWattLevelFilter(e.target.value)}
          >
            <option value="">All Watt Levels</option>
            {getUniqueWattLevels().map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        
        <div className="relative min-w-[150px]">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <select
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {getUniqueStatuses().map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Woredas by Demand */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-4 border-b border-slate-100">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Top Woredas by Demand
            </h4>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {getDemandsByWoreda().map(([woreda, count], index) => (
                <div key={woreda} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-slate-100 text-slate-800' :
                      index === 2 ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-slate-800">{woreda}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(count / getTotalDemands()) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solar Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-4 border-b border-slate-100">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              Solar Type Distribution
            </h4>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {getDemandsBySolarType().map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${(count / getTotalDemands()) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Watt Level Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-4 border-b border-slate-100">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Watt Level Analysis
            </h4>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {getDemandsByWattLevel().map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{level}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${(count / getTotalDemands()) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-4 border-b border-slate-100">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-600" />
              Status Overview
            </h4>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {Object.entries(getDemandsByStatus()).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          status === 'Pending Woreda Review' ? 'bg-amber-500' :
                          status === 'Approved for Zone Review' ? 'bg-emerald-500' :
                          status === 'Needs Adjustment' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} 
                        style={{ width: `${(count / getTotalDemands()) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800">Detailed Statistics</h4>
          <button
            onClick={() => {
              setSelectedDetail(filteredStatistics);
              setShowDetailsModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Woreda</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Solar Type</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Watt Level</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-right p-3 text-sm font-semibold text-slate-700">Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredStatistics.slice(0, 10).map((stat, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-sm text-slate-800">{stat.woreda}</td>
                  <td className="p-3 text-sm text-slate-800">{stat.solar_panel_type}</td>
                  <td className="p-3 text-sm text-slate-800">{stat.watt_level}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stat.status)}`}>
                      {stat.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-semibold text-slate-800 text-right">{stat.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStatistics.length > 10 && (
            <div className="p-3 text-center text-sm text-slate-500 border-t border-slate-100">
              Showing 10 of {filteredStatistics.length} results
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-slate-800">All Demand Statistics</h4>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Zone</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Woreda</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Solar Type</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Watt Level</th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-right p-3 text-sm font-semibold text-slate-700">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDetail.map((stat, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 text-sm text-slate-800">{stat.zone}</td>
                      <td className="p-3 text-sm text-slate-800">{stat.woreda}</td>
                      <td className="p-3 text-sm text-slate-800">{stat.solar_panel_type}</td>
                      <td className="p-3 text-sm text-slate-800">{stat.watt_level}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stat.status)}`}>
                          {stat.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm font-semibold text-slate-800 text-right">{stat.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandStatistics;

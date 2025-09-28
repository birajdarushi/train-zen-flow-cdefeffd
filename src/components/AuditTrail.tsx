import React, { useState } from 'react';
import { FileText, Search, Download, Filter, Calendar, User, Activity } from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'recommendation' | 'override' | 'simulation' | 'disruption' | 'system';
  status: 'success' | 'warning' | 'info';
  trainIds?: string[];
}

const auditEntries: AuditEntry[] = [
  {
    id: '1',
    timestamp: '2025-01-02 14:23:45',
    user: 'S. Sharma',
    action: 'AI Recommendation Accepted',
    details: 'Accepted precedence recommendation for train 12345 over 67890 at Junction A',
    type: 'recommendation',
    status: 'success',
    trainIds: ['12345', '67890'],
  },
  {
    id: '2',
    timestamp: '2025-01-02 14:18:22',
    user: 'System',
    action: 'Disruption Detected',
    details: 'Automatic detection of signal failure at Block 7-A, re-optimization initiated',
    type: 'disruption',
    status: 'warning',
  },
  {
    id: '3',
    timestamp: '2025-01-02 14:15:10',
    user: 'S. Sharma',
    action: 'Manual Override',
    details: 'Overrode AI recommendation for Express 23456, manual route selection applied',
    type: 'override',
    status: 'info',
    trainIds: ['23456'],
  },
  {
    id: '4',
    timestamp: '2025-01-02 14:10:33',
    user: 'A. Kumar',
    action: 'Scenario Simulation',
    details: 'Completed what-if analysis for peak hour traffic with track maintenance',
    type: 'simulation',
    status: 'success',
  },
  {
    id: '5',
    timestamp: '2025-01-02 13:55:17',
    user: 'S. Sharma',
    action: 'AI Recommendation Rejected',
    details: 'Rejected platform reallocation for train 45678 due to passenger safety concerns',
    type: 'recommendation',
    status: 'warning',
    trainIds: ['45678'],
  },
];

const typeColors = {
  recommendation: 'bg-blue-400/10 text-blue-400',
  override: 'bg-amber-400/10 text-amber-400',
  simulation: 'bg-purple-400/10 text-purple-400',
  disruption: 'bg-red-400/10 text-red-400',
  system: 'bg-slate-400/10 text-slate-400',
};

const statusIcons = {
  success: '✓',
  warning: '⚠',
  info: 'ℹ',
};

export const AuditTrail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState('today');

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileText className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Audit Trail</h2>
            <p className="text-slate-400">Decision tracking and system logs</p>
          </div>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search actions, details, or users..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Type Filter
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="recommendation">Recommendations</option>
              <option value="override">Overrides</option>
              <option value="simulation">Simulations</option>
              <option value="disruption">Disruptions</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Entries */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Activity Log</h3>
            <span className="text-slate-400 text-sm">{filteredEntries.length} entries</span>
          </div>
          
          <div className="space-y-4">
            {filteredEntries.map(entry => (
              <div key={entry.id} className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{statusIcons[entry.status]}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[entry.type]}`}>
                        {entry.type}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{entry.action}</h4>
                      <p className="text-sm text-slate-300 mb-2">{entry.details}</p>
                      {entry.trainIds && entry.trainIds.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400">Trains:</span>
                          {entry.trainIds.map(trainId => (
                            <span key={trainId} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded font-mono">
                              {trainId}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-3 h-3" />
                      <span>{entry.user}</span>
                    </div>
                    <div>{entry.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No entries found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
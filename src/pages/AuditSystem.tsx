import React, { useEffect, useMemo, useState, useCallback } from "react";
import { 
  Shield, FileText, Download, Search, Filter, Calendar, Clock, 
  User, AlertTriangle, CheckCircle, Eye, BarChart3, TrendingUp,
  Database, Settings, RefreshCw, Archive, Bell
} from "lucide-react";
// Remove XLSX import - we'll use a different approach

/**
 * Railway Traffic Control Audit System
 * Comprehensive audit trail and compliance monitoring for railway operations
 * Features: Real-time logging, compliance tracking, performance analytics, audit reports
 */

type AuditEventType = 
  | 'TRAIN_SCHEDULED' 
  | 'TRAIN_DELAYED' 
  | 'CONFLICT_RESOLVED' 
  | 'AI_DECISION' 
  | 'MANUAL_OVERRIDE' 
  | 'SYSTEM_CONFIG' 
  | 'SAFETY_ALERT' 
  | 'PERFORMANCE_METRIC'
  | 'USER_ACTION'
  | 'DATA_EXPORT';

type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'WARNING' | 'UNDER_REVIEW';

interface AuditEvent {
  id: string;
  timestamp: Date;
  type: AuditEventType;
  severity: SeverityLevel;
  user: string;
  section: string;
  trainId?: string;
  message: string;
  details: Record<string, any>;
  aiGenerated: boolean;
  complianceStatus: ComplianceStatus;
  actionRequired: boolean;
  resolved: boolean;
}

interface ComplianceMetric {
  id: string;
  name: string;
  description: string;
  target: number;
  actual: number;
  unit: string;
  status: ComplianceStatus;
  trend: 'UP' | 'DOWN' | 'STABLE';
  lastUpdated: Date;
}

interface AuditReport {
  id: string;
  title: string;
  period: { start: Date; end: Date };
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  events: AuditEvent[];
  metrics: ComplianceMetric[];
  summary: {
    totalEvents: number;
    criticalEvents: number;
    complianceScore: number;
    aiDecisions: number;
    manualOverrides: number;
  };
  generatedBy: string;
  generatedAt: Date;
}

export default function RailwayAuditSystem(): JSX.Element {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetric[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<AuditEventType | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | 'ALL'>('ALL');
  const [selectedUser, setSelectedUser] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [selectedReportType, setSelectedReportType] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'>('DAILY');

  useEffect(() => {
    // Initialize with sample audit data
    const sampleEvents = generateSampleAuditEvents();
    const sampleMetrics = generateSampleComplianceMetrics();
    
    setAuditEvents(sampleEvents);
    setComplianceMetrics(sampleMetrics);
    
    // Real-time updates disabled - events will remain static
    // If you want to re-enable real-time simulation, uncomment the code below:
    /*
    const interval = setInterval(() => {
      const newEvent = generateRandomAuditEvent();
      setAuditEvents(prev => [newEvent, ...prev]);
    }, 15000); // New event every 15 seconds

    return () => clearInterval(interval);
    */
  }, []);

  // Filter events based on criteria
  useEffect(() => {
    let filtered = [...auditEvents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.trainId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    // Severity filter
    if (selectedSeverity !== 'ALL') {
      filtered = filtered.filter(event => event.severity === selectedSeverity);
    }

    // User filter
    if (selectedUser !== 'ALL') {
      filtered = filtered.filter(event => event.user === selectedUser);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter(event => 
        event.timestamp >= startDate && event.timestamp <= endDate
      );
    }

    // Unresolved filter
    if (showUnresolvedOnly) {
      filtered = filtered.filter(event => !event.resolved && event.actionRequired);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [auditEvents, searchTerm, selectedType, selectedSeverity, selectedUser, dateRange, showUnresolvedOnly]);

  function generateSampleAuditEvents(): AuditEvent[] {
    const events: AuditEvent[] = [];
    const types: AuditEventType[] = ['TRAIN_SCHEDULED', 'TRAIN_DELAYED', 'CONFLICT_RESOLVED', 'AI_DECISION', 'MANUAL_OVERRIDE', 'SAFETY_ALERT'];
    const users = ['Controller_A', 'Controller_B', 'AI_System', 'Supervisor_X'];
    const severities: SeverityLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const trainIds = ['RAJ_001', 'LOC_045', 'GDS_123', 'EXP_777', 'SPL_999'];

    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const trainId = trainIds[Math.floor(Math.random() * trainIds.length)];
      
      events.push({
        id: `AUD_${Date.now()}_${i}`,
        timestamp,
        type,
        severity,
        user,
        section: 'Section_A',
        trainId: Math.random() > 0.3 ? trainId : undefined,
        message: generateEventMessage(type, trainId),
        details: generateEventDetails(type),
        aiGenerated: user === 'AI_System' || Math.random() > 0.6,
        complianceStatus: Math.random() > 0.8 ? 'NON_COMPLIANT' : 'COMPLIANT',
        actionRequired: severity === 'HIGH' || severity === 'CRITICAL',
        resolved: Math.random() > 0.3
      });
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  function generateSampleComplianceMetrics(): ComplianceMetric[] {
    return [
      {
        id: 'PUNCT_RATE',
        name: 'Punctuality Rate',
        description: 'Percentage of trains arriving within scheduled time',
        target: 95,
        actual: 92.3,
        unit: '%',
        status: 'WARNING',
        trend: 'DOWN',
        lastUpdated: new Date()
      },
      {
        id: 'SAFETY_SCORE',
        name: 'Safety Compliance Score',
        description: 'Overall safety compliance rating',
        target: 100,
        actual: 98.7,
        unit: '%',
        status: 'COMPLIANT',
        trend: 'UP',
        lastUpdated: new Date()
      },
      {
        id: 'AVG_DELAY',
        name: 'Average Delay Time',
        description: 'Mean delay across all train movements',
        target: 5,
        actual: 3.8,
        unit: 'minutes',
        status: 'COMPLIANT',
        trend: 'DOWN',
        lastUpdated: new Date()
      },
      {
        id: 'CONFLICT_RATE',
        name: 'Conflict Resolution Rate',
        description: 'Percentage of scheduling conflicts resolved automatically',
        target: 90,
        actual: 94.5,
        unit: '%',
        status: 'COMPLIANT',
        trend: 'STABLE',
        lastUpdated: new Date()
      }
    ];
  }

  function generateEventMessage(type: AuditEventType, trainId?: string): string {
    const messages: Record<AuditEventType, string[]> = {
      'TRAIN_SCHEDULED': [`Train ${trainId} successfully scheduled`, `Automatic scheduling completed for ${trainId}`],
      'TRAIN_DELAYED': [`Train ${trainId} delayed by 12 minutes`, `Delay detected for ${trainId} - investigating cause`],
      'CONFLICT_RESOLVED': [`Scheduling conflict resolved for ${trainId}`, `AI resolved conflict between trains`],
      'AI_DECISION': [`AI recommended priority adjustment for ${trainId}`, `Machine learning algorithm optimized schedule`],
      'MANUAL_OVERRIDE': [`Manual override applied by controller`, `User intervention for ${trainId} scheduling`],
      'SYSTEM_CONFIG': [`System configuration updated`, `Section parameters modified`],
      'SAFETY_ALERT': [`Safety protocol triggered for ${trainId}`, `Emergency braking signal activated`],
      'PERFORMANCE_METRIC': [`Performance threshold breach detected`, `KPI alert: punctuality below target`],
      'USER_ACTION': [`User logged into system`, `Configuration changed by operator`],
      'DATA_EXPORT': [`Audit report generated`, `Data export completed successfully`]
    };

    const typeMessages = messages[type];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }

  function generateEventDetails(type: AuditEventType): Record<string, any> {
    const baseDetails = {
      systemVersion: '2.1.4',
      sessionId: `SES_${Math.random().toString(36).substr(2, 9)}`,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255)
    };

    switch (type) {
      case 'TRAIN_SCHEDULED':
        return { ...baseDetails, platform: Math.floor(Math.random() * 10) + 1, estimatedDeparture: new Date() };
      case 'TRAIN_DELAYED':
        return { ...baseDetails, delayReason: 'Signal failure', originalTime: new Date(), newTime: new Date() };
      case 'AI_DECISION':
        return { ...baseDetails, confidence: Math.random(), algorithm: 'Neural Network v2.1' };
      default:
        return baseDetails;
    }
  }

  function generateRandomAuditEvent(): AuditEvent {
    const types: AuditEventType[] = ['TRAIN_SCHEDULED', 'AI_DECISION', 'PERFORMANCE_METRIC'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: `AUD_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      type,
      severity: 'LOW',
      user: 'AI_System',
      section: 'Section_A',
      trainId: 'RAJ_' + Math.floor(Math.random() * 999).toString().padStart(3, '0'),
      message: generateEventMessage(type),
      details: generateEventDetails(type),
      aiGenerated: true,
      complianceStatus: 'COMPLIANT',
      actionRequired: false,
      resolved: true
    };
  }

  async function generateAuditReport() {
    setIsGeneratingReport(true);
    
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prepare Events Data with ALL dashboard details
      const eventsData = filteredEvents.map(event => ({
        'Event ID': event.id,
        'Date': event.timestamp.toLocaleDateString(),
        'Time': event.timestamp.toLocaleTimeString(),
        'Full Timestamp': event.timestamp.toLocaleString(),
        'Event Type': event.type.replace('_', ' '),
        'Severity Level': event.severity,
        'User/Operator': event.user,
        'Railway Section': event.section,
        'Train ID': event.trainId || 'N/A',
        'Event Message': event.message,
        'AI Generated': event.aiGenerated ? 'Yes' : 'No',
        'Compliance Status': event.complianceStatus,
        'Action Required': event.actionRequired ? 'Yes' : 'No',
        'Status': event.resolved ? 'Resolved' : 'Pending',
        'Resolved': event.resolved ? 'Yes' : 'No',
        
        // Technical Details
        'System Version': event.details.systemVersion || 'N/A',
        'Session ID': event.details.sessionId || 'N/A',
        'IP Address': event.details.ipAddress || 'N/A',
        'Platform': event.details.platform || 'N/A',
        'Delay Reason': event.details.delayReason || 'N/A',
        'Algorithm Used': event.details.algorithm || 'N/A',
        'AI Confidence': event.details.confidence ? (event.details.confidence * 100).toFixed(2) + '%' : 'N/A',
        
        // Additional Context
        'Original Time': event.details.originalTime ? new Date(event.details.originalTime).toLocaleString() : 'N/A',
        'New Time': event.details.newTime ? new Date(event.details.newTime).toLocaleString() : 'N/A',
        'Estimated Departure': event.details.estimatedDeparture ? new Date(event.details.estimatedDeparture).toLocaleString() : 'N/A',
        
        // Status Indicators
        'Critical Event': event.severity === 'CRITICAL' ? 'Yes' : 'No',
        'Safety Related': event.type === 'SAFETY_ALERT' ? 'Yes' : 'No',
        'Manual Intervention': event.type === 'MANUAL_OVERRIDE' ? 'Yes' : 'No',
        'Conflict Resolution': event.type === 'CONFLICT_RESOLVED' ? 'Yes' : 'No',
        
        // Compliance Details
        'Compliant': event.complianceStatus === 'COMPLIANT' ? 'Yes' : 'No',
        'Non-Compliant': event.complianceStatus === 'NON_COMPLIANT' ? 'Yes' : 'No',
        'Warning Status': event.complianceStatus === 'WARNING' ? 'Yes' : 'No',
        'Under Review': event.complianceStatus === 'UNDER_REVIEW' ? 'Yes' : 'No',
        
        // Full Technical Details (JSON)
        'Complete Technical Details': JSON.stringify(event.details, null, 2)
      }));

      // Prepare Compliance Metrics Data
      const metricsData = complianceMetrics.map(metric => ({
        'Metric ID': metric.id,
        'Metric Name': metric.name,
        'Description': metric.description,
        'Target Value': `${metric.target}${metric.unit}`,
        'Actual Value': `${metric.actual}${metric.unit}`,
        'Status': metric.status,
        'Trend': metric.trend,
        'Last Updated': metric.lastUpdated.toLocaleString()
      }));

      // Prepare Summary Data
      const summaryData = [
        {
          'Report Type': selectedReportType,
          'Generated On': new Date().toLocaleString(),
          'Total Events': filteredEvents.length,
          'Critical Events': filteredEvents.filter(e => e.severity === 'CRITICAL').length,
          'High Severity Events': filteredEvents.filter(e => e.severity === 'HIGH').length,
          'AI Decisions': filteredEvents.filter(e => e.type === 'AI_DECISION').length,
          'Manual Overrides': filteredEvents.filter(e => e.type === 'MANUAL_OVERRIDE').length,
          'Safety Alerts': filteredEvents.filter(e => e.type === 'SAFETY_ALERT').length,
          'Compliance Rate': `${((filteredEvents.filter(e => e.complianceStatus === 'COMPLIANT').length / filteredEvents.length) * 100).toFixed(1)}%`,
          'Pending Actions': filteredEvents.filter(e => !e.resolved && e.actionRequired).length,
          'System Version': '2.1.4'
        }
      ];

      // Convert to CSV format
      const convertToCSV = (data: any[], title: string) => {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
          `"${title}"`,
          '', // Empty line
          headers.map(header => `"${header}"`).join(','),
          ...data.map(row => 
            headers.map(header => `"${String(row[header] || '').replace(/"/g, '""')}"`).join(',')
          )
        ].join('\n');
        
        return csvContent;
      };

      // Create CSV content with multiple sections
      const csvContent = [
        convertToCSV(summaryData, 'RAILWAY AUDIT REPORT SUMMARY'),
        '\n\n',
        convertToCSV(eventsData, 'AUDIT EVENTS'),
        '\n\n',
        convertToCSV(metricsData, 'COMPLIANCE METRICS')
      ].join('');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Railway_Audit_Report_${selectedReportType}_${timestamp}.csv`;

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      console.log(`CSV audit report generated: ${filename}`);
      
    } catch (error) {
      console.error('Error generating CSV report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  }

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    return filteredEvents.slice(startIndex, startIndex + eventsPerPage);
  }, [filteredEvents, currentPage, eventsPerPage]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const eventTypeColors: Record<AuditEventType, string> = {
    'TRAIN_SCHEDULED': 'bg-blue-900 text-blue-200 border-blue-700',
    'TRAIN_DELAYED': 'bg-red-900 text-red-200 border-red-700',
    'CONFLICT_RESOLVED': 'bg-green-900 text-green-200 border-green-700',
    'AI_DECISION': 'bg-purple-900 text-purple-200 border-purple-700',
    'MANUAL_OVERRIDE': 'bg-yellow-900 text-yellow-200 border-yellow-700',
    'SYSTEM_CONFIG': 'bg-gray-800 text-gray-200 border-gray-600',
    'SAFETY_ALERT': 'bg-red-900 text-red-100 border-red-600',
    'PERFORMANCE_METRIC': 'bg-cyan-900 text-cyan-200 border-cyan-700',
    'USER_ACTION': 'bg-indigo-900 text-indigo-200 border-indigo-700',
    'DATA_EXPORT': 'bg-teal-900 text-teal-200 border-teal-700'
  };

  const severityColors: Record<SeverityLevel, string> = {
    'LOW': 'text-green-400',
    'MEDIUM': 'text-yellow-400',
    'HIGH': 'text-orange-400',
    'CRITICAL': 'text-red-400'
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 mb-6">
          <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="text-pink-200" size={32} />
                <div>
                  <h1 className="text-2xl font-bold">Railway Traffic Control Audit System</h1>
                  <p className="text-indigo-100">Comprehensive Operations Monitoring & Compliance Tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={generateAuditReport}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  {isGeneratingReport ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Download size={16} />
                  )}
                  Generate Report
                </button>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{auditEvents.length}</div>
                <div className="text-xs text-gray-400">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {auditEvents.filter(e => e.severity === 'CRITICAL').length}
                </div>
                <div className="text-xs text-gray-400">Critical Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {auditEvents.filter(e => !e.resolved && e.actionRequired).length}
                </div>
                <div className="text-xs text-gray-400">Pending Actions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {((auditEvents.filter(e => e.complianceStatus === 'COMPLIANT').length / auditEvents.length) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">Compliance Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Filters & Compliance */}
          <div className="col-span-4 space-y-6">
            {/* Filters */}
            <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-4">
              <h2 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <Filter size={16} className="text-purple-400" />
                Event Filters
              </h2>
              
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-purple-500"
                      placeholder="Search events, trains, users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Event Type</label>
                  <select
                    className="w-full p-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-purple-500"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as AuditEventType | 'ALL')}
                  >
                    <option value="ALL">All Types</option>
                    <option value="TRAIN_SCHEDULED">Train Scheduled</option>
                    <option value="TRAIN_DELAYED">Train Delayed</option>
                    <option value="CONFLICT_RESOLVED">Conflict Resolved</option>
                    <option value="AI_DECISION">AI Decision</option>
                    <option value="MANUAL_OVERRIDE">Manual Override</option>
                    <option value="SAFETY_ALERT">Safety Alert</option>
                    <option value="SYSTEM_CONFIG">System Config</option>
                    <option value="PERFORMANCE_METRIC">Performance</option>
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Severity</label>
                  <select
                    className="w-full p-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-purple-500"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value as SeverityLevel | 'ALL')}
                  >
                    <option value="ALL">All Severities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="p-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                    <input
                      type="date"
                      className="p-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showUnresolvedOnly}
                      onChange={(e) => setShowUnresolvedOnly(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">Show unresolved only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Compliance Metrics */}
            <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-4">
              <h2 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-cyan-400" />
                Compliance Metrics
              </h2>
              
              <div className="space-y-4">
                {complianceMetrics.map((metric) => (
                  <div key={metric.id} className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-200">{metric.name}</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp 
                          size={12} 
                          className={`${
                            metric.trend === 'UP' ? 'text-green-400' : 
                            metric.trend === 'DOWN' ? 'text-red-400' : 
                            'text-gray-400'
                          }`} 
                        />
                        <span className={`text-xs px-2 py-1 rounded ${
                          metric.status === 'COMPLIANT' ? 'bg-green-900 text-green-200' :
                          metric.status === 'WARNING' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-red-900 text-red-200'
                        }`}>
                          {metric.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-100">
                      {metric.actual}{metric.unit}
                      <span className="text-sm text-gray-400 ml-2">/ {metric.target}{metric.unit}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'COMPLIANT' ? 'bg-green-500' : 
                          metric.status === 'WARNING' ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ 
                          width: `${Math.min(
                            metric.id === 'AVG_DELAY' 
                              ? Math.max(100 - (metric.actual / metric.target) * 100, 0)
                              : (metric.actual / metric.target) * 100, 
                            100
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Panel - Audit Events */}
          <div className="col-span-8">
            <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-100 flex items-center gap-2">
                    <FileText size={16} className="text-purple-400" />
                    Audit Events
                    <span className="text-sm text-gray-400">({filteredEvents.length} events)</span>
                  </h2>
                  
                  <div className="flex items-center gap-2">
                    <select
                      className="px-3 py-1 bg-gray-800 border border-gray-600 text-gray-100 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                      value={selectedReportType}
                      onChange={(e) => setSelectedReportType(e.target.value as any)}
                    >
                      <option value="DAILY">Daily Report</option>
                      <option value="WEEKLY">Weekly Report</option>
                      <option value="MONTHLY">Monthly Report</option>
                      <option value="CUSTOM">Custom Report</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Events List */}
                <div className="space-y-2">
                  {paginatedEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="p-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-750 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${eventTypeColors[event.type]}`}>
                              {event.type.replace('_', ' ')}
                            </span>
                            <span className={`text-xs font-bold ${severityColors[event.severity]}`}>
                              {event.severity}
                            </span>
                            {event.aiGenerated && (
                              <span className="px-2 py-1 bg-purple-900 text-purple-200 rounded text-xs">AI</span>
                            )}
                            {event.actionRequired && !event.resolved && (
                              <Bell className="text-red-400" size={14} />
                            )}
                          </div>
                          
                          <div className="text-gray-200 text-sm mb-1">{event.message}</div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {event.timestamp.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {event.user}
                            </span>
                            {event.trainId && (
                              <span>Train: {event.trainId}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            event.complianceStatus === 'COMPLIANT' ? 'bg-green-900 text-green-200' :
                            event.complianceStatus === 'WARNING' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-red-900 text-red-200'
                          }`}>
                            {event.complianceStatus}
                          </span>
                          {event.resolved ? (
                            <CheckCircle className="text-green-400" size={16} />
                          ) : event.actionRequired ? (
                            <AlertTriangle className="text-yellow-400" size={16} />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-400">
                      Showing {(currentPage - 1) * eventsPerPage + 1} to {Math.min(currentPage * eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-200 rounded text-sm transition-colors"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded text-sm transition-colors ${
                                currentPage === page 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        {totalPages > 5 && (
                          <>
                            <span className="text-gray-400">...</span>
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              className={`px-3 py-1 rounded text-sm transition-colors ${
                                currentPage === totalPages 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                              }`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-200 rounded text-sm transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                    <Eye size={20} className="text-purple-400" />
                    Event Details
                  </h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Event Header */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Event Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Event ID:</span>
                        <span className="text-gray-200 font-mono">{selectedEvent.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${eventTypeColors[selectedEvent.type]}`}>
                          {selectedEvent.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Severity:</span>
                        <span className={`font-bold ${severityColors[selectedEvent.severity]}`}>
                          {selectedEvent.severity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="text-gray-200">{selectedEvent.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">User:</span>
                        <span className="text-gray-200">{selectedEvent.user}</span>
                      </div>
                      {selectedEvent.trainId && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Train ID:</span>
                          <span className="text-gray-200 font-mono">{selectedEvent.trainId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Status & Compliance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">AI Generated:</span>
                        <span className={selectedEvent.aiGenerated ? 'text-purple-400' : 'text-gray-400'}>
                          {selectedEvent.aiGenerated ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compliance Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedEvent.complianceStatus === 'COMPLIANT' ? 'bg-green-900 text-green-200' :
                          selectedEvent.complianceStatus === 'WARNING' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-red-900 text-red-200'
                        }`}>
                          {selectedEvent.complianceStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Action Required:</span>
                        <span className={selectedEvent.actionRequired ? 'text-yellow-400' : 'text-gray-400'}>
                          {selectedEvent.actionRequired ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <div className="flex items-center gap-2">
                          <span className={selectedEvent.resolved ? 'text-green-400' : 'text-yellow-400'}>
                            {selectedEvent.resolved ? 'Resolved' : 'Pending'}
                          </span>
                          {selectedEvent.resolved ? (
                            <CheckCircle className="text-green-400" size={16} />
                          ) : (
                            <Clock className="text-yellow-400" size={16} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Message */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Event Message</h3>
                  <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <p className="text-gray-200">{selectedEvent.message}</p>
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Technical Details</h3>
                  <div className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                      {JSON.stringify(selectedEvent.details, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-3">
                    {!selectedEvent.resolved && selectedEvent.actionRequired && (
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                        Mark as Resolved
                      </button>
                    )}
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                      Export Event
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer - Summary Stats */}
        <div className="mt-8 bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {auditEvents.filter(e => e.type === 'AI_DECISION').length}
              </div>
              <div className="text-sm text-gray-400">AI Decisions Today</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {auditEvents.filter(e => e.type === 'CONFLICT_RESOLVED').length}
              </div>
              <div className="text-sm text-gray-400">Conflicts Resolved</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {auditEvents.filter(e => e.type === 'MANUAL_OVERRIDE').length}
              </div>
              <div className="text-sm text-gray-400">Manual Overrides</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {auditEvents.filter(e => e.type === 'SAFETY_ALERT').length}
              </div>
              <div className="text-sm text-gray-400">Safety Alerts</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              <strong className="text-purple-400">Audit System Status:</strong> Active monitoring with real-time event capture. 
              All operations are being logged for compliance and analysis. Data retention: 7 years.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              System Version: 2.1.4 • Last Backup: {new Date().toLocaleDateString()} • 
              Compliance Framework: ISO 55001, EN 50126, IEC 62425
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
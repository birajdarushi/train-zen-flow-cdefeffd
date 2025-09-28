import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Clock, Train, MapPin, Zap } from 'lucide-react';
import { DisruptionCard } from './DisruptionCard';

interface Disruption {
  id: string;
  type: 'signal' | 'track' | 'weather' | 'mechanical' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  affectedTrains: string[];
  estimatedDuration: string;
  status: 'active' | 'resolving' | 'resolved';
  detectedAt: string;
  aiRecommendations: string[];
}

const mockDisruptions: Disruption[] = [
  {
    id: '1',
    type: 'signal',
    severity: 'high',
    title: 'Signal Block Failure',
    description: 'Automatic signaling system failure at Block 7-A causing train holds',
    location: 'Block 7-A (Km 145.2)',
    affectedTrains: ['12345', '23456', '34567'],
    estimatedDuration: '45-60 minutes',
    status: 'active',
    detectedAt: '14:23',
    aiRecommendations: [
      'Reroute trains 12345 and 23456 via alternate track',
      'Hold train 34567 at previous station for 20 minutes',
      'Switch to manual signaling mode for affected section'
    ]
  },
  {
    id: '2',
    type: 'track',
    severity: 'medium',
    title: 'Track Maintenance',
    description: 'Scheduled maintenance causing single-line operation between stations',
    location: 'Between Station B-C (Km 89.5-92.1)',
    affectedTrains: ['45678', '56789'],
    estimatedDuration: '90 minutes',
    status: 'resolving',
    detectedAt: '13:45',
    aiRecommendations: [
      'Implement crossing priority for express trains',
      'Adjust station dwell times to optimize single-line usage',
      'Coordinate with maintenance team for expedited completion'
    ]
  },
  {
    id: '3',
    type: 'mechanical',
    severity: 'low',
    title: 'Engine Breakdown',
    description: 'Freight locomotive breakdown cleared, traffic resuming normally',
    location: 'Station D Platform 3',
    affectedTrains: ['67890'],
    estimatedDuration: 'Resolved',
    status: 'resolved',
    detectedAt: '12:30',
    aiRecommendations: []
  }
];

export const DisruptionManagement: React.FC = () => {
  const [disruptions, setDisruptions] = useState<Disruption[]>(mockDisruptions);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleReoptimize = (id: string) => {
    // Simulate re-optimization
    setDisruptions(prev =>
      prev.map(d => d.id === id ? { ...d, status: 'resolving' as const } : d)
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const activeDisruptions = disruptions.filter(d => d.status === 'active').length;
  const resolvingDisruptions = disruptions.filter(d => d.status === 'resolving').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Disruption Management</h2>
            <p className="text-slate-400">Real-time incident response and re-optimization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-slate-300">Active: {activeDisruptions}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-slate-300">Resolving: {resolvingDisruptions}</span>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {disruptions.map(disruption => (
          <DisruptionCard
            key={disruption.id}
            disruption={disruption}
            onReoptimize={handleReoptimize}
          />
        ))}
      </div>

      {disruptions.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No Active Disruptions</h3>
          <p className="text-slate-500">All systems operating normally</p>
        </div>
      )}
    </div>
  );
};
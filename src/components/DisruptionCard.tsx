import React from 'react';
import { AlertTriangle, MapPin, Clock, Train, Zap, RefreshCw, CheckCircle } from 'lucide-react';

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

interface DisruptionCardProps {
  disruption: Disruption;
  onReoptimize: (id: string) => void;
}

const severityColors = {
  low: 'border-blue-400 bg-blue-400/10',
  medium: 'border-amber-400 bg-amber-400/10',
  high: 'border-orange-400 bg-orange-400/10',
  critical: 'border-red-400 bg-red-400/10',
};

const statusColors = {
  active: 'text-red-400 bg-red-400/10',
  resolving: 'text-amber-400 bg-amber-400/10',
  resolved: 'text-green-400 bg-green-400/10',
};

const typeIcons = {
  signal: AlertTriangle,
  track: MapPin,
  weather: AlertTriangle,
  mechanical: Train,
  emergency: AlertTriangle,
};

export const DisruptionCard: React.FC<DisruptionCardProps> = ({
  disruption,
  onReoptimize,
}) => {
  const Icon = typeIcons[disruption.type];

  return (
    <div className={`bg-slate-800 border-2 rounded-lg p-6 ${severityColors[disruption.severity]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-slate-700 rounded-lg">
            <Icon className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{disruption.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${statusColors[disruption.status]}`}>
                {disruption.status}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${severityColors[disruption.severity]} text-white`}>
                {disruption.severity}
              </span>
            </div>
            <p className="text-slate-300 mb-3">{disruption.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Location:</span>
                <span className="text-white">{disruption.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Duration:</span>
                <span className="text-white">{disruption.estimatedDuration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Train className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Affected:</span>
                <span className="text-white">{disruption.affectedTrains.length} trains</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Detected: {disruption.detectedAt}</span>
        </div>
      </div>

      {disruption.aiRecommendations.length > 0 && (
        <div className="mb-4 p-4 bg-slate-900 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-medium text-white">AI Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {disruption.aiRecommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Affected Trains: {disruption.affectedTrains.map(train => (
            <span key={train} className="inline-block bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs mr-2 font-mono">
              {train}
            </span>
          ))}
        </div>

        {disruption.status === 'active' && (
          <button
            onClick={() => onReoptimize(disruption.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-optimize</span>
          </button>
        )}

        {disruption.status === 'resolving' && (
          <div className="flex items-center space-x-2 text-amber-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-medium">Re-optimizing...</span>
          </div>
        )}

        {disruption.status === 'resolved' && (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Resolved</span>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Settings, Train, Clock, MapPin, AlertTriangle } from 'lucide-react';

interface SimulationSetupProps {
  onRunSimulation: () => void;
}

export const SimulationSetup: React.FC<SimulationSetupProps> = ({ onRunSimulation }) => {
  const [scenario, setScenario] = useState('peak_traffic');
  const [timeWindow, setTimeWindow] = useState('4_hours');
  const [disruption, setDisruption] = useState('none');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Simulation Parameters</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Base Scenario
              </label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="peak_traffic">Peak Traffic Hours</option>
                <option value="normal_operations">Normal Operations</option>
                <option value="freight_heavy">Freight Heavy Period</option>
                <option value="express_priority">Express Train Priority</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time Window
              </label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="2_hours">2 Hours</option>
                <option value="4_hours">4 Hours</option>
                <option value="8_hours">8 Hours</option>
                <option value="24_hours">24 Hours</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Disruption Scenario
              </label>
              <select
                value={disruption}
                onChange={(e) => setDisruption(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">No Disruptions</option>
                <option value="signal_failure">Signal Block Failure</option>
                <option value="track_maintenance">Track Maintenance</option>
                <option value="rolling_stock_delay">Rolling Stock Delay</option>
                <option value="weather_impact">Weather Impact</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Train className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Expected Analysis</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-slate-300">Delay impact analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <Train className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">Throughput optimization</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">Resource utilization</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">Risk assessment</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-900 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Scenario Summary</h4>
            <div className="space-y-1 text-xs text-slate-400">
              <div>• Base: {scenario.replace('_', ' ').toUpperCase()}</div>
              <div>• Duration: {timeWindow.replace('_', ' ')}</div>
              <div>• Disruption: {disruption.replace('_', ' ').toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRunSimulation}
          className="flex items-center space-x-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Run Simulation</span>
        </button>
      </div>
    </div>
  );
};
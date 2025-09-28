import React, { useState } from 'react';
import { PlayCircle, Settings, BarChart3, Clock, Train, AlertTriangle } from 'lucide-react';
import { SimulationSetup } from './SimulationSetup';
import { SimulationResults } from './SimulationResults';

type SimulationState = 'setup' | 'running' | 'completed';

export const ScenarioSimulation: React.FC = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>('setup');
  const [progress, setProgress] = useState(0);

  const runSimulation = () => {
    setSimulationState('running');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulationState('completed');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const resetSimulation = () => {
    setSimulationState('setup');
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <PlayCircle className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Scenario Simulation</h2>
            <p className="text-slate-400">What-if analysis and operational modeling</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {simulationState === 'running' && (
            <div className="flex items-center space-x-3">
              <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-slate-300 text-sm">{progress}%</span>
            </div>
          )}
          
          {simulationState === 'completed' && (
            <button
              onClick={resetSimulation}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              New Simulation
            </button>
          )}
        </div>
      </div>

      {simulationState === 'setup' && (
        <SimulationSetup onRunSimulation={runSimulation} />
      )}

      {simulationState === 'running' && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin mx-auto mb-4 w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
            <h3 className="text-lg font-semibold text-white mb-2">Running Simulation...</h3>
            <p className="text-slate-400">Analyzing scenario parameters and computing outcomes</p>
            <div className="mt-4 text-sm text-slate-500">
              Processing train movements, signal constraints, and optimization algorithms
            </div>
          </div>
        </div>
      )}

      {simulationState === 'completed' && (
        <SimulationResults />
      )}
    </div>
  );
};
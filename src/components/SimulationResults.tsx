import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Clock, Train, AlertTriangle } from 'lucide-react';

export const SimulationResults: React.FC = () => {
  const results = {
    baseline: {
      avgDelay: 18.5,
      throughput: 142,
      efficiency: 76,
    },
    optimized: {
      avgDelay: 12.3,
      throughput: 158,
      efficiency: 89,
    },
    improvement: {
      delayReduction: 33.5,
      throughputIncrease: 11.3,
      efficiencyGain: 17.1,
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Simulation Results</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-300">Average Delay</h4>
              <Clock className="w-4 h-4 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Baseline</span>
                <span className="text-white">{results.baseline.avgDelay} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Optimized</span>
                <span className="text-green-400">{results.optimized.avgDelay} min</span>
              </div>
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-700">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">{results.improvement.delayReduction}% improvement</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-300">Daily Throughput</h4>
              <Train className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Baseline</span>
                <span className="text-white">{results.baseline.throughput} trains</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Optimized</span>
                <span className="text-blue-400">{results.optimized.throughput} trains</span>
              </div>
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-700">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">+{results.improvement.throughputIncrease}% increase</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-300">Section Efficiency</h4>
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Baseline</span>
                <span className="text-white">{results.baseline.efficiency}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Optimized</span>
                <span className="text-purple-400">{results.optimized.efficiency}%</span>
              </div>
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-700">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium">+{results.improvement.efficiencyGain}% efficiency</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Key Insights</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-slate-300 text-sm">
                    <span className="font-medium">Significant delay reduction</span> achieved through optimized precedence decisions
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-slate-300 text-sm">
                    <span className="font-medium">16 additional trains</span> can be processed daily with current infrastructure
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-slate-300 text-sm">
                    <span className="font-medium">Platform utilization</span> improved by 23% through intelligent scheduling
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-4">Recommendations</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                <div>
                  <p className="text-slate-300 text-sm">
                    Implement AI recommendations during peak hours (08:00-10:00) for maximum impact
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                <div>
                  <p className="text-slate-300 text-sm">
                    Focus on freight train optimization during off-peak periods
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                <div>
                  <p className="text-slate-300 text-sm">
                    Consider expanding simulation to include weather disruption scenarios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
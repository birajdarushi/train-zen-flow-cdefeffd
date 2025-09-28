import React, { useState, useMemo } from "react";
import { Train, Clock, BarChart3, Settings, MapPin, RefreshCw, AlertTriangle, TrendingUp, TrendingDown, Loader } from "lucide-react";

type Train = {
  id: string;
  name: string;
  type: "Express" | "Local" | "Freight";
  priority: number;
  arrivalTime: number; // minutes from start
  duration: number; // minutes at platform
  originalArrival: number;
  assignedPlatform?: number; // manually assigned platform
};

type ScheduleEntry = {
  train: Train;
  platform: number;
  startTime: number;
  endTime: number;
  delay: number;
  isManuallyAssigned: boolean;
};

export default function RailwayPlatformControl() {
  const [trains, setTrains] = useState<Train[]>([
    {
      id: "T001",
      name: "Rajdhani Express",
      type: "Express",
      priority: 9,
      arrivalTime: 10,
      duration: 5,
      originalArrival: 10
    },
    {
      id: "T002", 
      name: "Mumbai Local",
      type: "Local",
      priority: 4,
      arrivalTime: 15,
      duration: 3,
      originalArrival: 15
    },
    {
      id: "T003",
      name: "Freight Express",
      type: "Freight", 
      priority: 2,
      arrivalTime: 12,
      duration: 8,
      originalArrival: 12
    },
    {
      id: "T004",
      name: "Suburban Local",
      type: "Local",
      priority: 5,
      arrivalTime: 20,
      duration: 2,
      originalArrival: 20
    },
    {
      id: "T005",
      name: "Shatabdi Express",
      type: "Express",
      priority: 7,
      arrivalTime: 18,
      duration: 4,
      originalArrival: 18
    }
  ]);

  const [selectedTrain, setSelectedTrain] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [impactReport, setImpactReport] = useState<{
    show: boolean;
    oldMetrics: any;
    newMetrics: any;
    affectedTrains: string[];
    conflicts: Array<{trainId: string, type: string, description: string}>;
  }>({ show: false, oldMetrics: null, newMetrics: null, affectedTrains: [], conflicts: [] });

  // Generate optimized schedule
  const schedule = useMemo(() => {
    const result: ScheduleEntry[] = [];
    const platformUsage: { [platform: number]: Array<{start: number, end: number}> } = {
      1: [],
      2: [], 
      3: []
    };

    // First, handle manually assigned trains
    const manuallyAssigned = trains.filter(train => train.assignedPlatform);
    const autoAssigned = trains.filter(train => !train.assignedPlatform);

    // Process manually assigned trains first
    for (const train of manuallyAssigned) {
      const platform = train.assignedPlatform!;
      let startTime = train.arrivalTime;
      const usage = platformUsage[platform];
      
      // Find first available slot on assigned platform
      while (true) {
        const endTime = startTime + train.duration;
        const conflict = usage.find(slot => 
          (startTime < slot.end && endTime > slot.start)
        );
        
        if (!conflict) {
          // No conflict - book this slot
          usage.push({start: startTime, end: endTime});
          result.push({
            train,
            platform,
            startTime,
            endTime,
            delay: startTime - train.originalArrival,
            isManuallyAssigned: true
          });
          break;
        } else {
          // Move to after the conflicting slot
          startTime = conflict.end;
        }
      }
    }

    // Now process auto-assigned trains (sort by priority)
    const sortedAutoTrains = [...autoAssigned].sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.arrivalTime - b.arrivalTime;
    });

    for (const train of sortedAutoTrains) {
      let bestPlatform = 1;
      let bestStartTime = Infinity;

      // Check each platform for earliest available slot
      for (let platform = 1; platform <= 3; platform++) {
        let proposedStart = train.arrivalTime;
        const usage = platformUsage[platform];
        
        // Find first available slot on this platform
        while (true) {
          const proposedEnd = proposedStart + train.duration;
          const conflict = usage.find(slot => 
            (proposedStart < slot.end && proposedEnd > slot.start)
          );
          
          if (!conflict) {
            // No conflict - this slot works
            if (proposedStart < bestStartTime) {
              bestStartTime = proposedStart;
              bestPlatform = platform;
            }
            break;
          } else {
            // Move to after the conflicting slot
            proposedStart = conflict.end;
          }
        }
      }

      // Book the best platform
      const endTime = bestStartTime + train.duration;
      platformUsage[bestPlatform].push({start: bestStartTime, end: endTime});
      
      result.push({
        train,
        platform: bestPlatform,
        startTime: bestStartTime,
        endTime: endTime,
        delay: bestStartTime - train.originalArrival,
        isManuallyAssigned: false
      });
    }

    return result.sort((a, b) => a.startTime - b.startTime);
  }, [trains]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalDelay = schedule.reduce((sum, entry) => sum + entry.delay, 0);
    const avgDelay = totalDelay / schedule.length;
    const throughput = schedule.length;
    const maxDelay = Math.max(...schedule.map(entry => entry.delay));
    const onTimeTrains = schedule.filter(entry => entry.delay === 0).length;
    
    return {
      throughput,
      avgDelay: parseFloat(avgDelay.toFixed(1)),
      maxDelay,
      totalDelay,
      onTimeTrains,
      efficiency: parseFloat(((onTimeTrains / throughput) * 100).toFixed(1))
    };
  }, [schedule]);

  // Update impact report with new metrics when schedule changes
  React.useEffect(() => {
    if (impactReport.show && impactReport.oldMetrics && !impactReport.newMetrics) {
      setImpactReport(prev => ({
        ...prev,
        newMetrics: { ...metrics }
      }));
    }
  }, [metrics, impactReport]);

  const handlePlatformAssignment = async () => {
    if (selectedTrain && selectedPlatform) {
      setIsLoading(true);
      
      // Store current metrics for comparison
      const oldMetrics = { ...metrics };
      const platformNum = parseInt(selectedPlatform);
      const selectedTrainData = trains.find(t => t.id === selectedTrain);
      
      if (!selectedTrainData) return;

      // Algorithm processing stages with detailed analysis
      const stages = [
        "Analyzing current schedule...",
        "Detecting platform conflicts...",
        "Calculating cascading effects...",
        "Evaluating delay impacts...",
        "Optimizing train sequences...",
        "Finalizing assignment..."
      ];

      // Process each stage with realistic timing
      for (let i = 0; i < stages.length; i++) {
        setLoadingStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
      }

      // Detailed conflict and impact analysis
      const affectedTrainIds: string[] = [];
      const conflicts: Array<{trainId: string, type: string, description: string}> = [];
      
      // Find current schedule for the target platform
      const currentScheduleForPlatform = schedule.filter(entry => entry.platform === platformNum);
      const proposedStartTime = selectedTrainData.arrivalTime;
      const proposedEndTime = proposedStartTime + selectedTrainData.duration;
      
      // Check for direct time conflicts
      currentScheduleForPlatform.forEach(entry => {
        if (entry.train.id !== selectedTrain) {
          const hasDirectConflict = (proposedStartTime < entry.endTime && proposedEndTime > entry.startTime);
          
          if (hasDirectConflict) {
            // Direct conflict - this train will be pushed later
            affectedTrainIds.push(entry.train.id);
            conflicts.push({
              trainId: entry.train.id,
              type: "Direct Conflict",
              description: `${entry.train.name} will be delayed due to platform occupation conflict`
            });
          } else if (entry.startTime >= proposedStartTime) {
            // Cascading effect - trains scheduled after might be affected
            affectedTrainIds.push(entry.train.id);
            conflicts.push({
              trainId: entry.train.id,
              type: "Cascading Delay",
              description: `${entry.train.name} schedule may be shifted due to platform reallocation`
            });
          }
        }
      });

      // Check for potential improvements on other platforms
      const otherPlatformTrains = schedule.filter(entry => 
        entry.platform !== platformNum && 
        entry.delay > 0 && 
        entry.train.id !== selectedTrain
      );

      otherPlatformTrains.forEach(entry => {
        // This train might benefit from freed up space on its current platform
        conflicts.push({
          trainId: entry.train.id,
          type: "Potential Benefit",
          description: `${entry.train.name} might benefit from freed platform space`
        });
      });

      // Apply the assignment
      setTrains(prev => 
        prev.map(train => 
          train.id === selectedTrain 
            ? { ...train, assignedPlatform: platformNum }
            : train
        )
      );
      
      // Show completion and prepare report
      setLoadingStage("Assignment complete! Generating report...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setImpactReport({
        show: true,
        oldMetrics,
        newMetrics: null, // Will be calculated from the new schedule
        affectedTrains: [...new Set(affectedTrainIds)],
        conflicts
      });
      
      setIsLoading(false);
      setLoadingStage("");
      setSelectedTrain("");
      setSelectedPlatform("");
    }
  };

  const clearAssignment = (trainId: string) => {
    setImpactReport({ show: false, oldMetrics: null, newMetrics: null, affectedTrains: [], conflicts: [] });
    setTrains(prev => 
      prev.map(train => 
        train.id === trainId 
          ? { ...train, assignedPlatform: undefined }
          : train
      )
    );
  };

  const clearAllAssignments = () => {
    setImpactReport({ show: false, oldMetrics: null, newMetrics: null, affectedTrains: [], conflicts: [] });
    setTrains(prev => 
      prev.map(train => ({ ...train, assignedPlatform: undefined }))
    );
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "Express": return "bg-blue-600 text-blue-100";
      case "Local": return "bg-green-600 text-green-100"; 
      case "Freight": return "bg-orange-600 text-orange-100";
      default: return "bg-gray-600 text-gray-100";
    }
  };

  const getPlatformColor = (platform: number) => {
    switch(platform) {
      case 1: return "bg-red-500";
      case 2: return "bg-blue-500";
      case 3: return "bg-emerald-500";
      default: return "bg-gray-500";
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 px-6 py-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Train className="text-blue-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-white">Railway Section Control System</h1>
                <p className="text-gray-300 text-sm">Manual Platform Assignment & Traffic Management</p>
              </div>
            </div>
            
            {/* Key Metrics Dashboard - Compact */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400">{metrics.throughput}</div>
                <div className="text-xs text-gray-300">Total Trains</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{metrics.onTimeTrains}</div>
                <div className="text-xs text-gray-300">On Time</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{metrics.avgDelay}</div>
                <div className="text-xs text-gray-300">Avg Delay (min)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{metrics.maxDelay}</div>
                <div className="text-xs text-gray-300">Max Delay (min)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{metrics.efficiency}%</div>
                <div className="text-xs text-gray-300">Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">{metrics.totalDelay}</div>
                <div className="text-xs text-gray-300">Total Delay (min)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Platform Assignment Control */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <MapPin className="text-yellow-400" size={24} />
              Platform Assignment Control
            </h2>
            
            {/* Assignment Interface */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Assign Train to Platform</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Train:</label>
                  <select
                    value={selectedTrain}
                    onChange={(e) => setSelectedTrain(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Select Train --</option>
                    {trains.map((train) => (
                      <option key={train.id} value={train.id}>
                        {train.name} ({train.id}) - Priority {train.priority}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Platform:</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Select Platform --</option>
                    <option value="1">Platform 1</option>
                    <option value="2">Platform 2</option>
                    <option value="3">Platform 3</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handlePlatformAssignment}
                    disabled={!selectedTrain || !selectedPlatform || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <Loader className="animate-spin" size={16} />
                          <span className="text-sm">Processing...</span>
                        </div>
                        <span className="text-xs text-blue-200">{loadingStage}</span>
                      </div>
                    ) : (
                      'Assign Platform'
                    )}
                  </button>
                </div>
              </div>
              
              <button
                onClick={clearAllAssignments}
                className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Clear All Manual Assignments
              </button>
            </div>

            {/* Impact Analysis Report */}
            {impactReport.show && impactReport.newMetrics && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-yellow-500 shadow-lg">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Platform Assignment Impact Report</h3>
                    <p className="text-gray-300 text-sm mb-4">Analysis of how this manual assignment affects the overall schedule:</p>
                  </div>
                  <button 
                    onClick={() => setImpactReport({ show: false, oldMetrics: null, newMetrics: null, affectedTrains: [], conflicts: [] })}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Metrics Comparison */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-900 rounded p-3 text-center border border-gray-600">
                    <div className="text-xs text-gray-400 mb-1">Average Delay</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-300 text-sm">{impactReport.oldMetrics.avgDelay}m</span>
                      <span className="text-white">→</span>
                      <span className="text-white font-semibold">{impactReport.newMetrics.avgDelay}m</span>
                      {impactReport.newMetrics.avgDelay > impactReport.oldMetrics.avgDelay ? (
                        <TrendingUp className="text-red-400" size={14} />
                      ) : impactReport.newMetrics.avgDelay < impactReport.oldMetrics.avgDelay ? (
                        <TrendingDown className="text-green-400" size={14} />
                      ) : (
                        <span className="text-gray-400 text-sm">=</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded p-3 text-center border border-gray-600">
                    <div className="text-xs text-gray-400 mb-1">Max Delay</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-300 text-sm">{impactReport.oldMetrics.maxDelay}m</span>
                      <span className="text-white">→</span>
                      <span className="text-white font-semibold">{impactReport.newMetrics.maxDelay}m</span>
                      {impactReport.newMetrics.maxDelay > impactReport.oldMetrics.maxDelay ? (
                        <TrendingUp className="text-red-400" size={14} />
                      ) : impactReport.newMetrics.maxDelay < impactReport.oldMetrics.maxDelay ? (
                        <TrendingDown className="text-green-400" size={14} />
                      ) : (
                        <span className="text-gray-400 text-sm">=</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded p-3 text-center border border-gray-600">
                    <div className="text-xs text-gray-400 mb-1">Efficiency</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-300 text-sm">{impactReport.oldMetrics.efficiency}%</span>
                      <span className="text-white">→</span>
                      <span className="text-white font-semibold">{impactReport.newMetrics.efficiency}%</span>
                      {impactReport.newMetrics.efficiency > impactReport.oldMetrics.efficiency ? (
                        <TrendingUp className="text-green-400" size={14} />
                      ) : impactReport.newMetrics.efficiency < impactReport.oldMetrics.efficiency ? (
                        <TrendingDown className="text-red-400" size={14} />
                      ) : (
                        <span className="text-gray-400 text-sm">=</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded p-3 text-center border border-gray-600">
                    <div className="text-xs text-gray-400 mb-1">Total Delay</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-300 text-sm">{impactReport.oldMetrics.totalDelay}m</span>
                      <span className="text-white">→</span>
                      <span className="text-white font-semibold">{impactReport.newMetrics.totalDelay}m</span>
                      {impactReport.newMetrics.totalDelay > impactReport.oldMetrics.totalDelay ? (
                        <TrendingUp className="text-red-400" size={14} />
                      ) : impactReport.newMetrics.totalDelay < impactReport.oldMetrics.totalDelay ? (
                        <TrendingDown className="text-green-400" size={14} />
                      ) : (
                        <span className="text-gray-400 text-sm">=</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="bg-gray-900 rounded p-4 border border-gray-600 mb-4">
                  <h4 className="text-white font-medium mb-2">Impact Summary</h4>
                  <div className="space-y-2">
                    {impactReport.newMetrics.avgDelay > impactReport.oldMetrics.avgDelay ? (
                      <div className="flex items-center gap-2 text-red-300">
                        <AlertTriangle size={14} />
                        <span className="text-sm">
                          Average delay increased by {(impactReport.newMetrics.avgDelay - impactReport.oldMetrics.avgDelay).toFixed(1)} minutes
                        </span>
                      </div>
                    ) : impactReport.newMetrics.avgDelay < impactReport.oldMetrics.avgDelay ? (
                      <div className="flex items-center gap-2 text-green-300">
                        <TrendingDown size={14} />
                        <span className="text-sm">
                          Average delay improved by {(impactReport.oldMetrics.avgDelay - impactReport.newMetrics.avgDelay).toFixed(1)} minutes
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-sm">No change in average delay</span>
                      </div>
                    )}

                    <div className="text-gray-300 text-sm">
                      {impactReport.affectedTrains.length > 0 ? (
                        <>
                          <strong>{impactReport.affectedTrains.length}</strong> train(s) potentially affected by this change
                        </>
                      ) : (
                        'No other trains affected by this assignment'
                      )}
                    </div>

                    {/* Efficiency Impact */}
                    {impactReport.newMetrics.efficiency !== impactReport.oldMetrics.efficiency && (
                      <div className={`text-sm ${impactReport.newMetrics.efficiency > impactReport.oldMetrics.efficiency ? 'text-green-300' : 'text-red-300'}`}>
                        Overall efficiency {impactReport.newMetrics.efficiency > impactReport.oldMetrics.efficiency ? 'improved' : 'decreased'} by {Math.abs(impactReport.newMetrics.efficiency - impactReport.oldMetrics.efficiency).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Conflict Analysis */}
                {impactReport.conflicts && impactReport.conflicts.length > 0 && (
                  <div className="bg-gray-900 rounded p-4 border border-gray-600">
                    <h4 className="text-white font-medium mb-3">Detailed Impact Analysis</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {impactReport.conflicts.map((conflict, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <span className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            conflict.type === 'Direct Conflict' ? 'bg-red-400' :
                            conflict.type === 'Cascading Delay' ? 'bg-yellow-400' :
                            'bg-green-400'
                          }`}></span>
                          <div>
                            <span className={`font-medium ${
                              conflict.type === 'Direct Conflict' ? 'text-red-300' :
                              conflict.type === 'Cascading Delay' ? 'text-yellow-300' :
                              'text-green-300'
                            }`}>
                              {conflict.type}:
                            </span>
                            <span className="text-gray-300 ml-1">{conflict.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Current Assignments */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Train Status</h3>
              {trains.map((train) => (
                <div key={train.id} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(train.type)}`}>
                        {train.type}
                      </span>
                      <div>
                        <div className="text-white font-semibold">{train.name}</div>
                        <div className="text-gray-400 text-sm">
                          {train.id} • Priority {train.priority} • Arrives {formatTime(train.originalArrival)} • {train.duration}min
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {train.assignedPlatform ? (
                        <>
                          <span className={`inline-block w-3 h-3 rounded-full ${getPlatformColor(train.assignedPlatform)}`}></span>
                          <span className="text-white font-semibold">Platform {train.assignedPlatform}</span>
                          <span className="bg-green-600 text-green-100 px-2 py-1 rounded text-xs">Manual</span>
                          <button
                            onClick={() => clearAssignment(train.id)}
                            className="text-red-400 hover:text-red-300 ml-2"
                            title="Clear assignment"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Auto-assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Timetable */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Clock className="text-green-400" size={24} />
              Generated Timetable
            </h2>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 p-4 bg-gray-700 text-sm font-semibold text-gray-200 border-b border-gray-600">
                <div>Train Details</div>
                <div>Platform</div>
                <div>Scheduled</div>
                <div>Actual Start</div>
                <div>End Time</div>
                <div>Status</div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-gray-700">
                {schedule.map((entry, index) => (
                  <div key={entry.train.id} className={`grid grid-cols-6 gap-4 p-4 transition-colors ${
                    impactReport.affectedTrains.includes(entry.train.id) ? 'bg-yellow-900/30 border-l-4 border-yellow-500' : 'hover:bg-gray-750'
                  }`}>
                    <div>
                      <div className="text-white font-medium">{entry.train.name}</div>
                      <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${getTypeColor(entry.train.type)}`}>
                        {entry.train.type}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{entry.train.id}</div>
                      {impactReport.affectedTrains.includes(entry.train.id) && (
                        <div className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                          <AlertTriangle size={10} />
                          Affected
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`inline-block w-4 h-4 rounded-full ${getPlatformColor(entry.platform)} mr-2`}></span>
                      <span className="text-white font-semibold">PF {entry.platform}</span>
                      {entry.isManuallyAssigned && (
                        <span className="ml-2 bg-blue-600 text-blue-100 px-1 py-0.5 rounded text-xs">M</span>
                      )}
                    </div>
                    
                    <div className="text-white font-mono">{formatTime(entry.train.originalArrival)}</div>
                    <div className="text-white font-mono">{formatTime(entry.startTime)}</div>
                    <div className="text-white font-mono">{formatTime(entry.endTime)}</div>
                    
                    <div>
                      {entry.delay === 0 ? (
                        <span className="bg-green-600 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                          On Time
                        </span>
                      ) : (
                        <span className="bg-red-600 text-red-100 px-2 py-1 rounded-full text-xs font-medium">
                          +{entry.delay}min
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Legend */}
            <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-medium mb-3">Platform Legend</h4>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500"></span>
                  <span className="text-gray-300">Platform 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                  <span className="text-gray-300">Platform 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500"></span>
                  <span className="text-gray-300">Platform 3</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="bg-blue-600 text-blue-100 px-2 py-1 rounded text-xs">M</span>
                  <span className="text-gray-300">Manual Assignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
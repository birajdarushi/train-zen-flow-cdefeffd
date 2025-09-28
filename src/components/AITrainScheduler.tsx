import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, MapPin, AlertTriangle } from 'lucide-react';

interface Train {
  id: string;
  name: string;
  type: string;
  origin: string;
  destination: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  platform: number | null;
  priority: number;
  status: string;
  delay: number;
  aiOptimized: boolean;
  conflictResolved?: boolean;
}

interface PlatformSlot {
  arrival: number;
  departure: number;
  trainId: string;
}

interface PlatformSchedule {
  [key: number]: PlatformSlot[];
}

const AITrainScheduler: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);

  // Initialize trains
  const initializeTrains = (): void => {
    const mumbaiCentralTrains: Train[] = [
      {
        id: '12951',
        name: 'Rajdhani Express',
        type: 'Rajdhani',
        origin: 'Mumbai Central',
        destination: 'New Delhi',
        scheduledArrival: '06:15',
        scheduledDeparture: '06:35',
        platform: null,
        priority: 1,
        status: 'On Time',
        delay: 0,
        aiOptimized: false
      },
      {
        id: '12009',
        name: 'Shatabdi Express',
        type: 'Shatabdi',
        origin: 'Mumbai Central',
        destination: 'Ahmedabad',
        scheduledArrival: '06:20',
        scheduledDeparture: '06:25',
        platform: null,
        priority: 2,
        status: 'On Time',
        delay: 0,
        aiOptimized: false
      },
      {
        id: '19023',
        name: 'Freight Express',
        type: 'Freight',
        origin: 'JNPT Port',
        destination: 'Nagpur',
        scheduledArrival: '06:18',
        scheduledDeparture: '06:28',
        platform: null,
        priority: 4,
        status: 'On Time',
        delay: 0,
        aiOptimized: false
      },
      {
        id: '12471',
        name: 'Mumbai Local',
        type: 'Local',
        origin: 'Andheri',
        destination: 'Mumbai Central',
        scheduledArrival: '06:30',
        scheduledDeparture: '06:32',
        platform: null,
        priority: 3,
        status: 'Running Late',
        delay: 8,
        aiOptimized: false
      },
      {
        id: '59023',
        name: 'Suburban Local',
        type: 'Suburban',
        origin: 'Bandra',
        destination: 'Mumbai Central',
        scheduledArrival: '06:22',
        scheduledDeparture: '06:24',
        platform: null,
        priority: 3,
        status: 'Approaching',
        delay: 0,
        aiOptimized: false
      }
    ];
    setTrains(mumbaiCentralTrains);
  };

  // AI Scheduling Algorithm
  const runAIScheduling = (): void => {
    setTrains(prevTrains => {
      const updatedTrains: Train[] = [...prevTrains];
      const availablePlatforms: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const platformSchedule: PlatformSchedule = {};
      let conflictsResolved = 0;

      const sortedTrains = updatedTrains
        .map((train, index) => ({ ...train, originalIndex: index }))
        .sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          const timeA = new Date(`2025-09-28 ${a.scheduledArrival}`).getTime() + (a.delay * 60000);
          const timeB = new Date(`2025-09-28 ${b.scheduledArrival}`).getTime() + (b.delay * 60000);
          return timeA - timeB;
        });

      sortedTrains.forEach(train => {
        const arrivalTime = new Date(`2025-09-28 ${train.scheduledArrival}`).getTime() + (train.delay * 60000);
        const departureTime = new Date(`2025-09-28 ${train.scheduledDeparture}`).getTime() + (train.delay * 60000);

        let bestPlatform: number | null = null;
        let minConflict = Infinity;

        availablePlatforms.forEach(platform => {
          if (!platformSchedule[platform]) platformSchedule[platform] = [];

          const conflicts = platformSchedule[platform].filter(slot =>
            (arrivalTime < slot.departure && departureTime > slot.arrival)
          ).length;

          if (conflicts < minConflict) {
            minConflict = conflicts;
            bestPlatform = platform;
          }
        });

        if (bestPlatform && minConflict === 0) {
          train.platform = bestPlatform;
          train.conflictResolved = false;
          platformSchedule[bestPlatform].push({
            arrival: arrivalTime,
            departure: departureTime,
            trainId: train.id
          });
        } else if (bestPlatform) {
          train.platform = bestPlatform;
          train.conflictResolved = true;
          conflictsResolved++;

          if (train.priority >= 3) {
            const delayMinutes = 7 + Math.floor(Math.random() * 8);
            train.delay += delayMinutes;
            const newArrival = new Date(arrivalTime + delayMinutes * 60000);
            const newDeparture = new Date(departureTime + delayMinutes * 60000);
            train.scheduledArrival = newArrival.toTimeString().slice(0, 5);
            train.scheduledDeparture = newDeparture.toTimeString().slice(0, 5);
            train.status = 'Rescheduled';

            platformSchedule[bestPlatform].push({
              arrival: newArrival.getTime(),
              departure: newDeparture.getTime(),
              trainId: train.id
            });
          } else if (train.priority === 2) {
            const alternatePlatform = availablePlatforms.find(p =>
              p !== bestPlatform && (!platformSchedule[p] || platformSchedule[p].length === 0)
            );

            if (alternatePlatform) {
              train.platform = alternatePlatform;
              train.status = 'Platform Changed';
              platformSchedule[alternatePlatform] = platformSchedule[alternatePlatform] || [];
              platformSchedule[alternatePlatform].push({
                arrival: arrivalTime,
                departure: departureTime,
                trainId: train.id
              });
            } else {
              train.delay += 3;
              train.status = 'Minor Delay';
            }
          } else {
            train.status = 'Priority Override';
            platformSchedule[bestPlatform].push({
              arrival: arrivalTime,
              departure: departureTime,
              trainId: train.id
            });
          }
        }

        train.aiOptimized = true;
        if (train.originalIndex !== undefined) {
          updatedTrains[train.originalIndex] = train;
        }
      });

      if (conflictsResolved > 0) {
        console.log(`AI resolved ${conflictsResolved} platform conflicts`);
      }

      return updatedTrains;
    });
  };

  const getPriorityLabel = (priority: number): string => {
    const labels: string[] = ['', 'High', 'Medium', 'Medium', 'Low'];
    return labels[priority] || 'Standard';
  };

  const getStatusColorClasses = (status: string): string => {
    switch (status) {
      case 'On Time':
        return 'bg-success/20 text-success border border-success/40';
      case 'Delayed':
        return 'bg-destructive/20 text-destructive border border-destructive/40';
      case 'Running Late':
        return 'bg-warning/20 text-warning border border-warning/40';
      case 'Approaching':
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'Rescheduled':
        return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'Platform Changed':
        return 'bg-cyan-100 text-cyan-700 border border-cyan-300';
      case 'Minor Delay':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'Priority Override':
        return 'bg-pink-100 text-pink-700 border border-pink-300';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getPriorityColorClasses = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'bg-destructive/20 text-destructive border border-destructive/40';
      case 2:
        return 'bg-orange-100 text-orange-700 border border-orange-300';
      case 3:
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  useEffect(() => {
    initializeTrains();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-background min-h-screen">
      <div className="rounded-lg shadow-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Scheduler</h1>
            <p className="text-muted-foreground mt-1">Platform Assignment & Conflict Resolution</p>
          </div>
          
          <button
            onClick={runAIScheduling}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
            type="button"
          >
            <RefreshCw className="w-5 h-5" />
            Run AI Optimization
          </button>
        </div>

        {/* Train Schedule */}
        <div className="rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-muted/50 px-6 py-3 border-b border-border/50">
            <h2 className="text-lg font-semibold text-foreground">AI-Optimized Train Schedule</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Train Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Arrival</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Departure</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Platform</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Delay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {trains.map((train) => (
                  <tr key={train.id} className="hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${train.aiOptimized ? 'bg-blue-500' : 'bg-muted-foreground'}`}></div>
                        {train.conflictResolved && (
                          <div className="w-2 h-2 rounded-full bg-orange-400" title="Conflict Resolved"></div>
                        )}
                        <div>
                          <div className="font-medium text-foreground">{train.name}</div>
                          <div className="text-sm text-muted-foreground">{train.id} • {train.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{train.origin}</span>
                        <span>→</span>
                        <span className="text-foreground">{train.destination}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {train.scheduledArrival}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {train.scheduledDeparture}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {train.platform ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/40">
                          Platform {train.platform}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getPriorityColorClasses(train.priority)}`}>
                        {getPriorityLabel(train.priority)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusColorClasses(train.status)}`}>
                        {train.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {train.delay > 0 && <AlertTriangle className="w-4 h-4 text-warning" />}
                        <span className={`text-sm font-medium ${train.delay > 0 ? 'text-warning' : 'text-success'}`}>
                          {train.delay > 0 ? `+${train.delay}m` : 'On Time'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>AI Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <span>Conflict Resolved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
              <span>Original Schedule</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AITrainScheduler;

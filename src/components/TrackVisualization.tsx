import { useMemo, useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainData } from "@/types/railway";

interface TrackVisualizationProps {
  trains: Record<string, TrainData>;
  connectionStatus: string;
}

interface Track {
  id: number;
  name: string;
  yPosition: number;
  direction: 'eastbound' | 'westbound';
}

interface Section {
  id: string;
  xPosition: number;
  length: number; // default length for unknown sections
}

// Enhanced Train SVG Icon Component
const TrainIcon = ({ trainType, status, trainId }: { trainType: string; status: string; trainId: string }) => {
  const getTrainColor = () => {
    if (status !== 'RUNNING') return '#6b7280'; // Gray for stopped/halted trains
    
    switch (trainType) {
      case 'EXPRESS': return '#10b981'; // Green for express
      case 'PASSENGER': return '#f59e0b'; // Orange for passenger  
      case 'FREIGHT': return '#3b82f6'; // Blue for freight
      default: return '#8b5cf6'; // Purple default
    }
  };

  const isMoving = status === 'RUNNING';
  
  return (
    <div className="relative">
      <svg width="40" height="24" viewBox="0 0 40 24" className="drop-shadow-lg">
        {/* Train body - main compartment */}
        <rect
          x="4"
          y="8"
          width="32"
          height="12"
          rx="2"
          fill={getTrainColor()}
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        
        {/* Train front nose */}
        <path
          d="M36 8 L38 10 L38 18 L36 20"
          fill={getTrainColor()}
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        
        {/* Roof line */}
        <rect
          x="4"
          y="6"
          width="32"
          height="2"
          rx="1"
          fill="#374151"
        />
        
        {/* Windows */}
        <rect x="8" y="10" width="4" height="3" rx="1" fill="#e5e7eb" />
        <rect x="14" y="10" width="4" height="3" rx="1" fill="#e5e7eb" />
        <rect x="20" y="10" width="4" height="3" rx="1" fill="#e5e7eb" />
        <rect x="26" y="10" width="4" height="3" rx="1" fill="#e5e7eb" />
        
        {/* Front light */}
        <circle cx="37" cy="14" r="1.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="0.5" />
        
        {/* Wheels */}
        <circle cx="10" cy="21" r="2" fill="#374151" stroke="#6b7280" strokeWidth="1" />
        <circle cx="18" cy="21" r="2" fill="#374151" stroke="#6b7280" strokeWidth="1" />
        <circle cx="26" cy="21" r="2" fill="#374151" stroke="#6b7280" strokeWidth="1" />
        <circle cx="32" cy="21" r="2" fill="#374151" stroke="#6b7280" strokeWidth="1" />
        
        {/* Wheel centers */}
        <circle cx="10" cy="21" r="0.5" fill="#9ca3af" />
        <circle cx="18" cy="21" r="0.5" fill="#9ca3af" />
        <circle cx="26" cy="21" r="0.5" fill="#9ca3af" />
        <circle cx="32" cy="21" r="0.5" fill="#9ca3af" />
        
        {/* Side detail stripe */}
        <rect
          x="6"
          y="16"
          width="28"
          height="1"
          fill="#ffffff"
          opacity="0.7"
        />
        
        {/* Train number badge */}
        <rect
          x="28"
          y="4"
          width="8"
          height="3"
          rx="1"
          fill="#ffffff"
          stroke={getTrainColor()}
          strokeWidth="0.5"
        />
        <text
          x="32"
          y="6.5"
          textAnchor="middle"
          fontSize="2.5"
          fill={getTrainColor()}
          className="font-bold"
        >
          {trainId.slice(-2)}
        </text>
        
        {/* Moving effect - steam/speed lines */}
        {isMoving && (
          <>
            <line x1="2" y1="10" x2="4" y2="10" stroke="#94a3b8" strokeWidth="0.5" opacity="0.6" />
            <line x1="1" y1="12" x2="3" y2="12" stroke="#94a3b8" strokeWidth="0.5" opacity="0.4" />
            <line x1="2" y1="14" x2="4" y2="14" stroke="#94a3b8" strokeWidth="0.5" opacity="0.6" />
            <line x1="1" y1="16" x2="3" y2="16" stroke="#94a3b8" strokeWidth="0.5" opacity="0.4" />
          </>
        )}
      </svg>
      
      {/* Train type indicator */}
      <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full border border-white text-xs font-bold text-white flex items-center justify-center"
           style={{ backgroundColor: getTrainColor(), fontSize: '6px' }}>
        {trainType.charAt(0)}
      </div>
    </div>
  );
};

interface Track {
  id: number;
  name: string;
  yPosition: number;
  direction: 'eastbound' | 'westbound';
}

interface TrainPosition {
  train: TrainData;
  x: number;
  y: number;
  trackId: number;
  isHalted: boolean;
  stationStop?: boolean;
}

// Enhanced track system with side tracks
const tracks: Track[] = [
  { id: 1, name: "Track 1 (Main East)", yPosition: 30, direction: 'eastbound' },
  { id: 2, name: "Track 2 (Main West)", yPosition: 40, direction: 'westbound' },
  { id: 3, name: "Track 3 (Side East)", yPosition: 50, direction: 'eastbound' },
  { id: 4, name: "Track 4 (Side West)", yPosition: 60, direction: 'westbound' },
];

// Demo tracks for showcase (always animated)
const demoTracks: Track[] = [
  { id: 5, name: "Demo Track A", yPosition: 75, direction: 'eastbound' },
  { id: 6, name: "Demo Track B", yPosition: 85, direction: 'westbound' },
];

// Enhanced live train animation interface
interface LiveTrain extends TrainData {
  animatedPosition: number; // For continuous movement
  assignedTrackId: number;
  baseSpeed: number; // Speed factor for animation
}

// Demo train data for continuous animation
interface DemoTrain {
  id: string;
  type: 'PASSENGER' | 'FREIGHT' | 'EXPRESS';
  trackId: number;
  position: number; // 0 to 100
  speed: number; // pixels per update
  direction: 1 | -1; // 1 for forward, -1 for backward
}

const createDemoTrains = (): DemoTrain[] => [
  {
    id: "DEMO_001",
    type: "EXPRESS",
    trackId: 5, // Demo Track A
    position: Math.random() * 100,
    speed: 0.8,
    direction: 1
  },
  {
    id: "DEMO_002", 
    type: "PASSENGER",
    trackId: 5, // Demo Track A
    position: Math.random() * 100,
    speed: 0.6,
    direction: 1
  },
  {
    id: "DEMO_003",
    type: "FREIGHT",
    trackId: 6, // Demo Track B
    position: Math.random() * 100,
    speed: 0.4,
    direction: -1
  },
  {
    id: "DEMO_004",
    type: "EXPRESS",
    trackId: 6, // Demo Track B
    position: Math.random() * 100,
    speed: 0.7,
    direction: -1
  }
];

// Station positions along the route
const stations = [
  { id: "S01", name: "Delhi", position: 15 },
  { id: "S02", name: "Junction A", position: 35 },
  { id: "S03", name: "Station B", position: 65 },
  { id: "S04", name: "Ghaziabad", position: 85 },
];

// Get station position by section ID with better animation support
const getStationPosition = (sectionId: string): number => {
  const station = stations.find(s => s.id === sectionId);
  if (station) return station.position;
  
  // Fallback: calculate position from section number
  const sectionNumber = parseInt(sectionId.replace(/\D/g, '')) || 1;
  // Keep trains within safe track bounds (15% to 80%)
  return Math.max(15, Math.min(80, 15 + (sectionNumber - 1) * 15));
};

// Smart track assignment with side track switching
const assignTrackForTrain = (train: TrainData, trainsByTrack: { [trackId: number]: TrainPosition[] }): number => {
  // Determine direction based on destination/section pattern
  const sectionNumber = parseInt(train.current_section_id.replace(/\D/g, '')) || 1;
  const isEastbound = sectionNumber % 2 === 1 || train.train_id.includes('E'); // Odd sections or 'E' in ID = eastbound
  
  if (isEastbound) {
    // Check main eastbound track (1) first
    if (trainsByTrack[1].length < 3) return 1;
    // If main track is crowded, use side eastbound track (3)
    return 3;
  } else {
    // Check main westbound track (2) first
    if (trainsByTrack[2].length < 3) return 2;
    // If main track is crowded, use side westbound track (4)
    return 4;
  }
};

// Enhanced train positioning with continuous animation and smart track switching
const calculateTrainPositions = (trains: Record<string, TrainData>, liveTrainAnimations: Map<string, LiveTrain>): TrainPosition[] => {
  const trainsByTrack: { [trackId: number]: TrainPosition[] } = { 1: [], 2: [], 3: [], 4: [] };
  
  // Process each train with continuous animation
  Object.values(trains).forEach((train) => {
    // Get or create animated train state
    let animatedTrain = liveTrainAnimations.get(train.train_id);
    if (!animatedTrain) {
      const basePosition = getStationPosition(train.current_section_id);
      animatedTrain = {
        ...train,
        animatedPosition: basePosition,
        assignedTrackId: assignTrackForTrain(train, trainsByTrack),
        baseSpeed: train.speed_kmh > 0 ? Math.max(0.3, train.speed_kmh / 200) : 0
      };
      liveTrainAnimations.set(train.train_id, animatedTrain);
    }
    
    // Update animated position for running trains
    if (train.status === 'RUNNING' && train.speed_kmh > 0) {
      const speedFactor = Math.max(0.5, train.speed_kmh / 120); // Scale speed for animation
      animatedTrain.animatedPosition += speedFactor;
      
      // Wrap around at track end
      if (animatedTrain.animatedPosition > TRACK_END) {
        animatedTrain.animatedPosition = TRACK_START; // Reset to start
      }
    } else if (train.status === 'STOPPED') {
      // Stopped trains stay at station
      animatedTrain.animatedPosition = getStationPosition(train.current_section_id);
    }
    
    // Update train data
    animatedTrain = { ...animatedTrain, ...train };
    liveTrainAnimations.set(train.train_id, animatedTrain);
    
    // Get assigned track
    const track = tracks.find(t => t.id === animatedTrain.assignedTrackId)!;
    
    // Create position data
    const trainPosition: TrainPosition = {
      train: animatedTrain,
      x: Math.max(TRACK_START, Math.min(TRACK_END, animatedTrain.animatedPosition)),
      y: track.yPosition,
      trackId: animatedTrain.assignedTrackId,
      isHalted: train.status !== 'RUNNING' || train.speed_kmh <= 0,
      stationStop: train.status === 'STOPPED'
    };
    
    trainsByTrack[animatedTrain.assignedTrackId].push(trainPosition);
  });
  
  // Resolve overlaps by moving trains to side tracks
  Object.keys(trainsByTrack).forEach(trackIdStr => {
    const trackId = parseInt(trackIdStr);
    const trainsOnTrack = trainsByTrack[trackId];
    
    // Sort by X position
    trainsOnTrack.sort((a, b) => a.x - b.x);
    
    // Check for overlaps and move to side tracks
    for (let i = 1; i < trainsOnTrack.length; i++) {
      const currentTrain = trainsOnTrack[i];
      const previousTrain = trainsOnTrack[i - 1];
      
      if (currentTrain.x - previousTrain.x < MIN_TRAIN_SPACING) {
        // Find alternative track
        let alternativeTrackId = trackId;
        
        if (trackId === 1 && trainsByTrack[3].length < trainsByTrack[1].length) {
          alternativeTrackId = 3; // Move from main east to side east
        } else if (trackId === 2 && trainsByTrack[4].length < trainsByTrack[2].length) {
          alternativeTrackId = 4; // Move from main west to side west
        } else if (trackId === 3 && trainsByTrack[1].length < trainsByTrack[3].length) {
          alternativeTrackId = 1; // Move from side east to main east
        } else if (trackId === 4 && trainsByTrack[2].length < trainsByTrack[4].length) {
          alternativeTrackId = 2; // Move from side west to main west
        }
        
        if (alternativeTrackId !== trackId) {
          // Move train to alternative track
          const alternativeTrack = tracks.find(t => t.id === alternativeTrackId)!;
          currentTrain.trackId = alternativeTrackId;
          currentTrain.y = alternativeTrack.yPosition;
          
          // Update live train animation data
          const liveTrainData = liveTrainAnimations.get(currentTrain.train.train_id);
          if (liveTrainData) {
            liveTrainData.assignedTrackId = alternativeTrackId;
          }
          
          // Move to alternative track array
          trainsByTrack[alternativeTrackId].push(currentTrain);
          trainsOnTrack.splice(i, 1);
          i--; // Adjust index after removal
        } else {
          // If no alternative track, adjust position slightly
          currentTrain.x = Math.min(TRACK_END, previousTrain.x + MIN_TRAIN_SPACING);
        }
      }
    }
  });
  
  // Combine all tracks
  return [...trainsByTrack[1], ...trainsByTrack[2], ...trainsByTrack[3], ...trainsByTrack[4]];
};

// Dynamic sections based on backend data
const getSectionPosition = (sectionId: string): number => {
  // Extract number from section ID (e.g., "S05" -> 5) and map to x position
  const sectionNumber = parseInt(sectionId.replace(/\D/g, '')) || 1;
  return Math.min(10 + (sectionNumber * 8), 90); // Spread across 10% to 90% of width
};

// Constants for animation and positioning
const MIN_TRAIN_SPACING = 12; // 12% spacing to prevent overlaps
const TRACK_START = 15; // Safe start position
const TRACK_END = 85;   // Safe end position to prevent derailing

export function TrackVisualization({ trains, connectionStatus }: TrackVisualizationProps) {
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [demoTrains, setDemoTrains] = useState<DemoTrain[]>(createDemoTrains());
  const [liveTrainAnimations] = useState<Map<string, LiveTrain>>(new Map());
  const animationRef = useRef<number>();
  const liveAnimationRef = useRef<number>();
  const liveAnimationTimer = useRef<NodeJS.Timeout>();
  
  // Live train animation loop - updates every second
  useEffect(() => {
    const animateLiveTrains = () => {
      if (Object.keys(trains).length > 0) {
        // Update live train animated positions based on their speed
        liveTrainAnimations.forEach((liveTrain, trainId) => {
          const currentTrain = trains[trainId];
          if (currentTrain && currentTrain.status === 'RUNNING' && currentTrain.speed_kmh > 0) {
            // Calculate movement based on speed (rough approximation)
            const speedFactor = currentTrain.speed_kmh / 100; // Normalize speed to 0-1
            const movementIncrement = speedFactor * 2; // Move up to 2% per second
            
            // Update animated position
            liveTrain.animatedPosition += movementIncrement;
            
            // Keep within track bounds and wrap around if needed
            if (liveTrain.animatedPosition > 85) {
              liveTrain.animatedPosition = 15; // Wrap to start
            }
          }
        });
        
        // Force re-render to show movement
        setLastUpdateTime(Date.now());
      }
    };
    
    // Start live train animation timer (every 1000ms = 1 second)
    liveAnimationTimer.current = setInterval(animateLiveTrains, 1000);
    
    return () => {
      if (liveAnimationTimer.current) {
        clearInterval(liveAnimationTimer.current);
      }
    };
  }, [trains, liveTrainAnimations]);
  
  // Demo train animation loop
  useEffect(() => {
    const animate = () => {
      setDemoTrains(prevTrains => 
        prevTrains.map(train => {
          let newPosition = train.position + (train.speed * train.direction);
          
          // Wrap around when train reaches end
          if (train.direction === 1 && newPosition > 95) {
            newPosition = 5; // Reset to start
          } else if (train.direction === -1 && newPosition < 5) {
            newPosition = 95; // Reset to end
          }
          
          return {
            ...train,
            position: newPosition
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Force re-render when train data changes to trigger animation
  useEffect(() => {
    setLastUpdateTime(Date.now());
  }, [trains]);

  const trainPositions = useMemo(() => {
    return calculateTrainPositions(trains, liveTrainAnimations);
  }, [trains, lastUpdateTime]); // Include lastUpdateTime to ensure recalculation

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary">Live Track View</CardTitle>
          <div className="flex gap-2">
            <Badge 
              className={
                connectionStatus === 'connected' 
                  ? "bg-operational/20 text-operational border-operational" 
                  : "bg-critical/20 text-critical border-critical"
              }
            >
              {connectionStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-400">
              DEMO MODE
            </Badge>
            <Badge className="bg-muted/50 text-muted-foreground">
              {Object.keys(trains).length + demoTrains.length} total trains
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-80 railway-grid rounded-lg border border-border/30 overflow-hidden bg-gradient-to-br from-background/50 to-muted/20">
          {/* Enhanced Multi-Track Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Main Live Data Tracks (4 tracks) */}
            {tracks.map((track) => (
              <g key={track.id}>
                {/* Main track line */}
                <line
                  x1="10%"
                  y1={`${track.yPosition}%`}
                  x2="90%"
                  y2={`${track.yPosition}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth={track.id <= 2 ? "4" : "3"} 
                  opacity={track.id <= 2 ? "0.9" : "0.7"}
                />
                {/* Track direction indicator */}
                <text
                  x="3%"
                  y={`${track.yPosition - 2}%`}
                  fill="hsl(var(--muted-foreground))"
                  fontSize="9"
                  className="font-medium"
                >
                  {track.name}
                </text>
                {/* Direction arrow */}
                <path
                  d={track.direction === 'eastbound' ? "M88,0 L92,0 L90,-2 M92,0 L90,2" : "M12,0 L8,0 L10,-2 M8,0 L10,2"}
                  transform={`translate(0, ${track.yPosition * 4.8})`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  fill="none"
                />
              </g>
            ))}
            
            {/* Demo Tracks */}
            {demoTracks.map((track) => (
              <g key={track.id}>
                {/* Demo track line */}
                <line
                  x1="5%"
                  y1={`${track.yPosition}%`}
                  x2="95%"
                  y2={`${track.yPosition}%`}
                  stroke="hsl(var(--accent))"
                  strokeWidth="3"
                  opacity="0.6"
                  strokeDasharray="5,5"
                />
                {/* Demo track label */}
                <text
                  x="2%"
                  y={`${track.yPosition - 2}%`}
                  fill="hsl(var(--accent-foreground))"
                  fontSize="9"
                  className="font-medium"
                >
                  {track.name} (Demo)
                </text>
                {/* Direction arrow */}
                <path
                  d={track.direction === 'eastbound' ? "M92,0 L96,0 L94,-1.5 M96,0 L94,1.5" : "M8,0 L4,0 L6,-1.5 M4,0 L6,1.5"}
                  transform={`translate(0, ${track.yPosition * 4.8})`}
                  stroke="hsl(var(--accent))"
                  strokeWidth="1"
                  fill="none"
                />
              </g>
            ))}
            
            {/* Station markers */}
            {stations.map((station) => (
              <g key={station.id}>
                <line
                  x1={`${station.position}%`}
                  y1="25%"
                  x2={`${station.position}%`}
                  y2="65%"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <text
                  x={`${station.position}%`}
                  y="20%"
                  fill="hsl(var(--foreground))"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {station.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Live Trains with Continuous Animation */}
          {trainPositions.map((trainPos) => {
            return (
              <div
                key={trainPos.train.train_id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                  trainPos.train.status === 'RUNNING' 
                    ? 'transition-all duration-1000 ease-linear' 
                    : trainPos.isHalted 
                    ? 'transition-all duration-500 ease-out animate-pulse' 
                    : 'transition-all duration-1000 ease-in-out'
                }`}
                style={{
                  left: `${trainPos.x}%`,
                  top: `${trainPos.y}%`,
                  zIndex: trainPos.train.status === 'RUNNING' ? 20 : 15,
                }}
              >
                {/* Enhanced Train Icon */}
                <TrainIcon 
                  trainType={trainPos.train.train_type}
                  status={trainPos.train.status}
                  trainId={trainPos.train.train_id}
                />

                {/* Live Train Movement Indicator */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping border border-white"></div>

                {/* Enhanced Speed indicator for running trains */}
                {trainPos.train.status === 'RUNNING' && trainPos.train.speed_kmh > 0 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="flex space-x-0.5">
                      <div 
                        className="w-2 h-2 bg-green-400 rounded-full animate-ping" 
                        style={{ animationDelay: '0s', animationDuration: '0.8s' }}
                      ></div>
                      <div 
                        className="w-1.5 h-1.5 bg-green-300 rounded-full animate-ping" 
                        style={{ animationDelay: '0.2s', animationDuration: '0.8s' }}
                      ></div>
                      <div 
                        className="w-1 h-1 bg-green-200 rounded-full animate-ping" 
                        style={{ animationDelay: '0.4s', animationDuration: '0.8s' }}
                      ></div>
                    </div>
                    {/* Speed text */}
                    <div className="absolute -bottom-4 left-0 text-xs text-green-400 font-bold">
                      {Math.round(trainPos.train.speed_kmh)} km/h
                    </div>
                  </div>
                )}
                
                {/* Track indicator */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded border border-primary/30">
                    T{trainPos.trackId}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Demo Trains - Always Animated */}
          {demoTrains.map((demoTrain) => {
            const track = demoTracks.find(t => t.id === demoTrain.trackId)!;
            
            return (
              <div
                key={demoTrain.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-none"
                style={{
                  left: `${demoTrain.position}%`,
                  top: `${track.yPosition}%`,
                  zIndex: 15, // Above live trains
                }}
              >
                {/* Demo Train Icon */}
                <TrainIcon 
                  trainType={demoTrain.type}
                  status="RUNNING"
                  trainId={demoTrain.id}
                />
                
                {/* Demo Train Speed Indicator */}
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <div className="flex space-x-0.5">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-0.5 h-0.5 bg-blue-200 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                
                {/* Demo label */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded border border-blue-400/30">
                    DEMO
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 bg-green-500 rounded-sm border border-white"></div>
              <span className="text-muted-foreground">Express Train</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 bg-orange-500 rounded-sm border border-white"></div>
              <span className="text-muted-foreground">Passenger Train</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 bg-blue-500 rounded-sm border border-white"></div>
              <span className="text-muted-foreground">Freight Train</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 bg-red-500 rounded-sm border border-white"></div>
              <span className="text-muted-foreground">Signal Block</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
          <div>
            Live railway operations • {Object.keys(trains).length} active trains • {demoTrains.length} demo trains • Updated: {new Date().toLocaleTimeString()}
            {Object.keys(trains).length > 0 && (
              <span className="text-green-400 ml-2 animate-pulse">● LIVE TRAINS MOVING</span>
            )}
          </div>
          
          {/* Animation Status */}
          <div className="flex gap-4">
            <span>
              Running: {trainPositions.filter(t => t.train.status === 'RUNNING').length}
            </span>
            <span>
              Halted: {trainPositions.filter(t => t.isHalted).length}
            </span>
            <span className="text-blue-400">
              Demo: {demoTrains.length} trains
            </span>
            {connectionStatus === 'connected' ? (
              <span className="text-green-500">● LIVE DATA</span>
            ) : (
              <span className="text-orange-500">● DEMO MODE - Connect backend for live data</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
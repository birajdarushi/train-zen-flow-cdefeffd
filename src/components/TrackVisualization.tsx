import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainData } from "@/types/railway";

interface TrackVisualizationProps {
  trains: Record<string, TrainData>;
  connectionStatus: string;
}

interface Section {
  id: string;
  name: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  length: number; // meters
}

const sections: Section[] = [
  { id: "S01", name: "New Delhi", startPosition: { x: 5, y: 50 }, endPosition: { x: 15, y: 45 }, length: 2000 },
  { id: "S02", name: "Ghaziabad", startPosition: { x: 15, y: 45 }, endPosition: { x: 25, y: 42 }, length: 1800 },
  { id: "S03", name: "Meerut Jn", startPosition: { x: 25, y: 42 }, endPosition: { x: 35, y: 38 }, length: 2200 },
  { id: "S04", name: "Muzaffarnagar", startPosition: { x: 35, y: 38 }, endPosition: { x: 45, y: 35 }, length: 1900 },
  { id: "S05", name: "Saharanpur", startPosition: { x: 45, y: 35 }, endPosition: { x: 55, y: 32 }, length: 2100 },
  { id: "S06", name: "Roorkee", startPosition: { x: 55, y: 32 }, endPosition: { x: 65, y: 29 }, length: 1700 },
  { id: "S07", name: "Haridwar", startPosition: { x: 65, y: 29 }, endPosition: { x: 75, y: 26 }, length: 1600 },
  { id: "S08", name: "Rishikesh", startPosition: { x: 75, y: 26 }, endPosition: { x: 85, y: 23 }, length: 1500 },
];

export function TrackVisualization({ trains, connectionStatus }: TrackVisualizationProps) {
  const trainPositions = useMemo(() => {
    return Object.values(trains).map(train => {
      const section = sections.find(s => s.id === train.current_section_id);
      if (!section) return null;

      // Calculate position along the section based on meters
      const progressRatio = train.position_in_section_meters / section.length;
      const clampedProgress = Math.max(0, Math.min(1, progressRatio));

      const x = section.startPosition.x + (section.endPosition.x - section.startPosition.x) * clampedProgress;
      const y = section.startPosition.y + (section.endPosition.y - section.startPosition.y) * clampedProgress;

      return {
        ...train,
        visualPosition: { x, y },
        section
      };
    }).filter(Boolean);
  }, [trains]);

  const getTrainStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return 'bg-operational';
      case 'DELAYED': return 'bg-delayed';
      case 'HOLDING': return 'bg-warning';
      case 'STOPPED': return 'bg-critical';
      default: return 'bg-muted';
    }
  };

  const getTrainTypeIcon = (type: string) => {
    switch (type) {
      case 'EXPRESS': return '🚄';
      case 'PASSENGER': return '🚃';
      case 'FREIGHT': return '🚂';
      default: return '🚊';
    }
  };

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
            <Badge className="bg-muted/50 text-muted-foreground">
              {Object.keys(trains).length} trains
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-80 railway-grid rounded-lg border border-border/30 overflow-hidden bg-gradient-to-br from-background/50 to-muted/20">
          {/* Track Sections */}
          <svg className="absolute inset-0 w-full h-full">
            {sections.map((section, index) => {
              const nextSection = sections[index + 1];
              if (!nextSection) return null;
              
              return (
                <g key={section.id}>
                  {/* Main track line */}
                  <line
                    x1={`${section.endPosition.x}%`}
                    y1={`${section.endPosition.y}%`}
                    x2={`${nextSection.startPosition.x}%`}
                    y2={`${nextSection.startPosition.y}%`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    opacity="0.6"
                  />
                  {/* Parallel track line */}
                  <line
                    x1={`${section.endPosition.x}%`}
                    y1={`${section.endPosition.y + 1}%`}
                    x2={`${nextSection.startPosition.x}%`}
                    y2={`${nextSection.startPosition.y + 1}%`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    opacity="0.4"
                  />
                </g>
              );
            })}
          </svg>

          {/* Section Stations */}
          {sections.map((section) => (
            <div
              key={section.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${section.startPosition.x}%`,
                top: `${section.startPosition.y}%`,
              }}
            >
              <div className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/50" />
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs text-foreground bg-background/90 px-2 py-1 rounded border border-border/50 font-medium">
                  {section.name}
                </span>
              </div>
            </div>
          ))}

          {/* Live Trains */}
          {trainPositions.map((trainPos) => {
            if (!trainPos) return null;
            
            return (
              <div
                key={trainPos.train_id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
                style={{
                  left: `${trainPos.visualPosition.x}%`,
                  top: `${trainPos.visualPosition.y}%`,
                }}
              >
                {/* Train Icon */}
                <div
                  className={`w-6 h-4 rounded-sm border-2 border-background shadow-lg ${getTrainStatusColor(trainPos.status)} flex items-center justify-center text-xs`}
                >
                  <span className="text-white font-bold" style={{ fontSize: '8px' }}>
                    {getTrainTypeIcon(trainPos.train_type)}
                  </span>
                </div>
                
                {/* Train Info */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="text-xs bg-background/95 px-2 py-1 rounded border border-border/50 shadow-sm">
                    <div className="font-bold text-foreground">{trainPos.train_id}</div>
                    <div className="text-muted-foreground">
                      {Math.round(trainPos.speed_kmh)} km/h
                      {trainPos.signal_delay_seconds && trainPos.signal_delay_seconds > 0 && (
                        <span className="text-delayed ml-1">
                          +{Math.round(trainPos.signal_delay_seconds / 60)}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Speed indicator */}
                {trainPos.status === 'RUNNING' && trainPos.speed_kmh > 0 && (
                  <div 
                    className="absolute w-8 h-1 bg-operational/60 rounded-full animate-pulse"
                    style={{
                      top: '50%',
                      left: '100%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                )}
              </div>
            );
          })}
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-operational rounded-sm"></div>
              <span className="text-muted-foreground">Running</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-delayed rounded-sm"></div>
              <span className="text-muted-foreground">Delayed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-warning rounded-sm"></div>
              <span className="text-muted-foreground">Holding</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-critical rounded-sm"></div>
              <span className="text-muted-foreground">Stopped</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Live railway operations • {Object.keys(trains).length} active trains • Updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
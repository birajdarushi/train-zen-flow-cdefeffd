import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Station {
  id: string;
  name: string;
  position: { x: number; y: number };
  type: "junction" | "station" | "crossing";
}

interface Train {
  id: string;
  position: { x: number; y: number };
  status: "operational" | "delayed" | "critical";
  number: string;
}

const mockStations: Station[] = [
  { id: "1", name: "New Delhi", position: { x: 10, y: 50 }, type: "junction" },
  { id: "2", name: "Ghaziabad", position: { x: 30, y: 40 }, type: "station" },
  { id: "3", name: "Meerut", position: { x: 50, y: 35 }, type: "crossing" },
  { id: "4", name: "Muzaffarnagar", position: { x: 70, y: 30 }, type: "station" },
  { id: "5", name: "Saharanpur", position: { x: 90, y: 25 }, type: "junction" },
];

const mockTrains: Train[] = [
  { id: "1", position: { x: 20, y: 45 }, status: "operational", number: "12345" },
  { id: "2", position: { x: 60, y: 32 }, status: "delayed", number: "67890" },
  { id: "3", position: { x: 80, y: 28 }, status: "operational", number: "11223" },
];

export function SectionMap() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary">Section Overview</CardTitle>
        <div className="flex gap-2">
          <Badge className="bg-operational/20 text-operational border-operational">Operational</Badge>
          <Badge className="bg-delayed/20 text-delayed border-delayed">Delayed</Badge>
          <Badge className="bg-critical/20 text-critical border-critical">Critical</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 railway-grid rounded-lg border border-border/30 overflow-hidden">
          {/* Railway Line */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 20 120 Q 200 80 380 60"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              opacity="0.7"
            />
          </svg>
          
          {/* Stations */}
          {mockStations.map((station) => (
            <div
              key={station.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${station.position.x}%`,
                top: `${station.position.y}%`,
              }}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  station.type === "junction"
                    ? "bg-primary border-primary shadow-lg shadow-primary/50"
                    : station.type === "crossing"
                    ? "bg-warning border-warning"
                    : "bg-accent border-accent"
                }`}
              />
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs text-foreground bg-background/80 px-1 py-0.5 rounded border border-border/50">
                  {station.name}
                </span>
              </div>
            </div>
          ))}
          
          {/* Trains */}
          {mockTrains.map((train) => (
            <div
              key={train.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${train.position.x}%`,
                top: `${train.position.y}%`,
              }}
            >
              <div
                className={`w-4 h-2 rounded-sm ${
                  train.status === "operational"
                    ? "bg-operational"
                    : train.status === "delayed"
                    ? "bg-delayed"
                    : "bg-critical pulse-glow"
                }`}
              />
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <span className="text-xs text-foreground bg-background/90 px-1 py-0.5 rounded border border-border/50">
                  {train.number}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Real-time section monitoring • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
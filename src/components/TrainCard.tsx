import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Zap } from "lucide-react";

interface TrainCardProps {
  trainNumber: string;
  trainName: string;
  currentLocation: string;
  nextStation: string;
  status: "operational" | "delayed" | "critical" | "maintenance";
  delay?: number;
  priority: "express" | "freight" | "passenger";
  eta: string;
  aiRecommendation?: string;
}

export function TrainCard({
  trainNumber,
  trainName,
  currentLocation,
  nextStation,
  status,
  delay = 0,
  priority,
  eta,
  aiRecommendation
}: TrainCardProps) {
  const priorityColors = {
    express: "bg-primary/20 text-primary border-primary",
    freight: "bg-accent/20 text-accent border-accent",
    passenger: "bg-secondary/20 text-secondary-foreground border-border"
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-primary">{trainNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">{trainName}</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <StatusBadge variant={status}>
              {status.toUpperCase()}
            </StatusBadge>
            <Badge className={priorityColors[priority]}>
              {priority.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{currentLocation}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-accent">{nextStation}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>ETA: {eta}</span>
            {delay > 0 && (
              <span className="text-delayed font-medium">+{delay}min</span>
            )}
          </div>
        </div>
        
        {aiRecommendation && (
          <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-primary">AI RECOMMENDATION</span>
            </div>
            <p className="text-xs text-foreground/90">{aiRecommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
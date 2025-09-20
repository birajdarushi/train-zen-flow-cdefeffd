import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrainCard } from "@/components/TrainCard";
import { MetricCard } from "@/components/MetricCard";
import { SectionMap } from "@/components/SectionMap";
import { 
  Train, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const mockTrains = [
  {
    trainNumber: "12345",
    trainName: "Rajdhani Express",
    currentLocation: "New Delhi",
    nextStation: "Ghaziabad",
    status: "operational" as const,
    delay: 0,
    priority: "express" as const,
    eta: "14:30",
    aiRecommendation: "Maintain current speed. Clear track ahead."
  },
  {
    trainNumber: "67890",
    trainName: "Freight Express",
    currentLocation: "Meerut Junction",
    nextStation: "Muzaffarnagar", 
    status: "delayed" as const,
    delay: 15,
    priority: "freight" as const,
    eta: "15:45",
    aiRecommendation: "Reduce precedence to passenger train. Alternative: Platform 2."
  },
  {
    trainNumber: "11223",
    trainName: "Shatabdi Express",
    currentLocation: "Saharanpur",
    nextStation: "Dehradun",
    status: "operational" as const,
    delay: 0,
    priority: "express" as const,
    eta: "16:15"
  }
];

const Index = () => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  
  return (
    <div className="min-h-screen bg-background railway-grid">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Train className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-primary">Railway Control Center</h1>
                  <p className="text-sm text-muted-foreground">AI-Powered Operations Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-operational/20 text-operational border-operational">
                SYSTEM ACTIVE
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary">
                <Zap className="w-3 h-3 mr-1" />
                AI ONLINE
              </Badge>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active Trains"
            value="47"
            change={{ value: 12, trend: "up" }}
            icon={Train}
            description="Currently in section"
          />
          <MetricCard
            title="Avg Delay"
            value="8.2 min"
            change={{ value: 15, trend: "down" }}
            icon={Clock}
            description="vs last period"
          />
          <MetricCard
            title="Throughput"
            value="156"
            change={{ value: 8, trend: "up" }}
            icon={TrendingUp}
            description="trains/day"
          />
          <MetricCard
            title="Incidents"
            value="2"
            change={{ value: 60, trend: "down" }}
            icon={AlertTriangle}
            description="active alerts"
          />
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section Map */}
          <div className="lg:col-span-2">
            <SectionMap />
          </div>
          
          {/* AI Recommendations Panel */}
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-operational/10 border border-operational/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-operational animate-pulse" />
                    <span className="text-sm font-semibold text-operational">PRIORITY</span>
                  </div>
                  <p className="text-sm text-foreground/90">
                    Grant precedence to Train 12345 at Junction A. Expected delay reduction: 12 minutes.
                  </p>
                </div>
                
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-sm font-semibold text-warning">CAUTION</span>
                  </div>
                  <p className="text-sm text-foreground/90">
                    Platform congestion detected at Station B. Consider alternative routing.
                  </p>
                </div>
                
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-semibold text-primary">OPTIMIZE</span>
                  </div>
                  <p className="text-sm text-foreground/90">
                    Adjust crossing timing at Signal C to improve overall throughput by 8%.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Simulation Controls */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-primary">Scenario Simulation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button 
                    variant={simulationRunning ? "destructive" : "default"}
                    size="sm" 
                    onClick={() => setSimulationRunning(!simulationRunning)}
                    className="flex-1"
                  >
                    {simulationRunning ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Sim
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Sim
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {simulationRunning ? "Simulation running..." : "Test scenarios and disruptions"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Train List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Active Trains</h2>
            <Badge className="bg-muted/50 text-muted-foreground">
              {mockTrains.length} trains monitored
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockTrains.map((train) => (
              <TrainCard key={train.trainNumber} {...train} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

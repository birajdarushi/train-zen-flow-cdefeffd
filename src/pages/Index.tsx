import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrainCard } from "@/components/TrainCard";
import { MetricCard } from "@/components/MetricCard";
import { TrackVisualization } from "@/components/TrackVisualization";
import { AIRecommendationsPanel } from "@/components/AIRecommendationsPanel";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeSwitch } from "@/components/theme-switch";
import { useWebSocket } from "@/hooks/useWebSocket";
import { railwayApi } from "@/services/railwayApi";
import { useToast } from "@/hooks/use-toast";
import  AITrainScheduler from "@/components/AITrainScheduler";
import { 
  Train, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Wifi,
  WifiOff
} from "lucide-react";

const Index = () => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const { trains, events, conflicts, connectionStatus, reconnect } = useWebSocket();
  const { toast } = useToast();

  const handleOptimizationRequest = async () => {
    try {
      const trainData = Object.values(trains).map(train => ({
        train_id: train.train_id,
        current_section: train.current_section_id,
        destination: train.destination,
        priority: train.priority,
        delay_minutes: Math.floor((train.signal_delay_seconds || 0) / 60),
        train_type: train.train_type
      }));

      if (trainData.length === 0) {
        toast({
          title: "No Active Trains",
          description: "Connect to the railway system to see live trains and generate optimizations.",
          duration: 3000,
        });
        return;
      }

      const optimization = await railwayApi.requestOptimization({
        trains: trainData,
        optimization_criteria: ['minimize_delays', 'maximize_throughput']
      });

      toast({
        title: "Optimization Generated",
        description: `Generated ${optimization.candidates.length} optimization candidates.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Unable to generate optimization. Check API connection.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
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
              <Badge 
                className={
                  connectionStatus === 'connected' 
                    ? "bg-operational/20 text-operational border-operational" 
                    : "bg-critical/20 text-critical border-critical"
                }
              >
                {connectionStatus === 'connected' ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    LIVE DATA
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    OFFLINE
                  </>
                )}
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary">
                <Zap className="w-3 h-3 mr-1" />
                AI ONLINE
              </Badge>
              {connectionStatus !== 'connected' && (
                <Button variant="outline" size="sm" onClick={reconnect}>
                  Reconnect
                </Button>
              )}
              
              {/* Theme Toggle */}
              <div className="flex items-center gap-2">
                <ThemeSwitch />
                <div className="w-px h-6 bg-border mx-2" />
                <ThemeToggle />
              </div>
              
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
            value={Object.keys(trains).length.toString()}
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
            value={(events.length + conflicts.length).toString()}
            change={{ value: 60, trend: "down" }}
            icon={AlertTriangle}
            description="active alerts"
          />
        </div>

        {/* AI Train Scheduler - Above Main Dashboard */}
        <div className="w-full">
          <AITrainScheduler />
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Track Visualization */}
          <div className="lg:col-span-2">
            <TrackVisualization trains={trains} connectionStatus={connectionStatus} />
          </div>
          
          {/* AI Recommendations Panel */}
          <div className="space-y-4">
            <AIRecommendationsPanel 
              trains={trains} 
              onOptimizationRequest={handleOptimizationRequest}
            />
            
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
              {Object.keys(trains).length} trains monitored
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.values(trains).length > 0 ? (
              Object.values(trains).map((train) => (
                <TrainCard 
                  key={train.train_id} 
                  trainNumber={train.train_id}
                  trainName={`${train.train_type} Service`}
                  currentLocation={train.current_section_id}
                  nextStation={train.destination}
                  status={train.status.toLowerCase() as any}
                  delay={Math.floor((train.signal_delay_seconds || 0) / 60)}
                  priority={train.train_type.toLowerCase() as any}
                  eta={new Date(train.expected_exit_timestamp).toLocaleTimeString()}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Train className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Active Trains</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to the railway system to monitor live train operations
                </p>
                {connectionStatus !== 'connected' && (
                  <Button variant="outline" className="mt-4" onClick={reconnect}>
                    <Wifi className="w-4 h-4 mr-2" />
                    Connect to Railway System
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

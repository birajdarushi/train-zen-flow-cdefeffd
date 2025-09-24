import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Route,
  AlertTriangle
} from "lucide-react";
import { OptimizationCandidate } from "@/types/railway";
import { railwayApi } from "@/services/railwayApi";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendationsPanelProps {
  trains: Record<string, any>;
  onOptimizationRequest: () => void;
}

interface Recommendation {
  id: string;
  type: 'precedence' | 'reroute' | 'delay' | 'optimize';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  candidate?: OptimizationCandidate;
  optimizationId?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const mockRecommendations: Recommendation[] = [
  {
    id: 'rec_001',
    type: 'precedence',
    priority: 'high',
    title: 'Grant Precedence to T001',
    description: 'Grant precedence to Train T001 at Junction S05. This will reduce overall network delay by 12 minutes.',
    impact: '12 min delay reduction',
    status: 'pending'
  },
  {
    id: 'rec_002',
    type: 'reroute',
    priority: 'medium',
    title: 'Alternative Route for T007',
    description: 'Reroute Train T007 through S06-S08 to avoid congestion at S07. Minimal delay impact.',
    impact: '3 min additional travel time',
    status: 'pending'
  },
  {
    id: 'rec_003',
    type: 'optimize',
    priority: 'low',
    title: 'Signal Timing Optimization',
    description: 'Adjust signal timing at S12 to improve throughput by 8% during peak hours.',
    impact: '8% throughput increase',
    status: 'pending'
  }
];

export function AIRecommendationsPanel({ trains, onOptimizationRequest }: AIRecommendationsPanelProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAcceptRecommendation = async (recommendation: Recommendation) => {
    setIsProcessing(true);
    try {
      if (recommendation.optimizationId && recommendation.candidate) {
        await railwayApi.acceptOptimization(
          recommendation.optimizationId,
          recommendation.candidate.candidate_id
        );
      }
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendation.id 
            ? { ...rec, status: 'accepted' as const }
            : rec
        )
      );

      toast({
        title: "Recommendation Accepted",
        description: `${recommendation.title} has been implemented.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to Accept",
        description: "Unable to implement recommendation. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRecommendation = async (recommendation: Recommendation) => {
    setIsProcessing(true);
    try {
      if (recommendation.optimizationId && recommendation.candidate) {
        await railwayApi.rejectOptimization(
          recommendation.optimizationId,
          recommendation.candidate.candidate_id,
          "Rejected by operator"
        );
      }
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendation.id 
            ? { ...rec, status: 'rejected' as const }
            : rec
        )
      );

      toast({
        title: "Recommendation Rejected",
        description: `${recommendation.title} has been dismissed.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to Reject",
        description: "Unable to dismiss recommendation. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-critical" />;
      case 'medium': return <Clock className="w-4 h-4 text-warning" />;
      case 'low': return <TrendingUp className="w-4 h-4 text-operational" />;
      default: return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'precedence': return <Route className="w-4 h-4" />;
      case 'reroute': return <Route className="w-4 h-4" />;
      case 'delay': return <Clock className="w-4 h-4" />;
      case 'optimize': return <TrendingUp className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const pendingRecommendations = recommendations.filter(rec => rec.status === 'pending');
  const processedRecommendations = recommendations.filter(rec => rec.status !== 'pending');

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOptimizationRequest}
            disabled={isProcessing}
          >
            <Zap className="w-4 h-4 mr-2" />
            Optimize
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingRecommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No pending recommendations</p>
            <p className="text-xs">System monitoring for optimization opportunities</p>
          </div>
        )}

        {pendingRecommendations.map((recommendation) => (
          <div 
            key={recommendation.id}
            className={`p-4 rounded-lg border ${
              recommendation.priority === 'high' 
                ? 'bg-critical/10 border-critical/20' 
                : recommendation.priority === 'medium'
                ? 'bg-warning/10 border-warning/20'
                : 'bg-operational/10 border-operational/20'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getPriorityIcon(recommendation.priority)}
                <Badge 
                  className={
                    recommendation.priority === 'high'
                      ? "bg-critical/20 text-critical border-critical"
                      : recommendation.priority === 'medium'
                      ? "bg-warning/20 text-warning border-warning"
                      : "bg-operational/20 text-operational border-operational"
                  }
                >
                  {recommendation.priority.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                {getTypeIcon(recommendation.type)}
                <span className="text-xs uppercase">{recommendation.type}</span>
              </div>
            </div>
            
            <h4 className="font-semibold text-foreground mb-2">{recommendation.title}</h4>
            <p className="text-sm text-foreground/90 mb-3">{recommendation.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-primary font-medium">
                Impact: {recommendation.impact}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRejectRecommendation(recommendation)}
                  disabled={isProcessing}
                  className="text-critical border-critical/20 hover:bg-critical/10"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAcceptRecommendation(recommendation)}
                  disabled={isProcessing}
                  className="bg-operational hover:bg-operational/90 text-white"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Accept
                </Button>
              </div>
            </div>
          </div>
        ))}

        {processedRecommendations.length > 0 && (
          <div className="pt-4 border-t border-border/30">
            <h5 className="text-sm font-medium text-muted-foreground mb-3">Recent Actions</h5>
            <div className="space-y-2">
              {processedRecommendations.slice(0, 3).map((recommendation) => (
                <div 
                  key={recommendation.id}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
                >
                  <span className="text-foreground/80">{recommendation.title}</span>
                  <Badge 
                    className={
                      recommendation.status === 'accepted'
                        ? "bg-operational/20 text-operational border-operational"
                        : "bg-critical/20 text-critical border-critical"
                    }
                  >
                    {recommendation.status === 'accepted' ? 'ACCEPTED' : 'REJECTED'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
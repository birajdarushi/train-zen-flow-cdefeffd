export interface TrainData {
  train_id: string;
  train_type: "PASSENGER" | "FREIGHT" | "EXPRESS";
  status: "RUNNING" | "DELAYED" | "HOLDING" | "STOPPED";
  current_section_id: string;
  position_in_section_meters: number;
  speed_kmh: number;
  destination: string;
  priority: number;
  precedence_rank: number;
  eta_to_section_exit: number;
  expected_exit_timestamp: string;
  delayed_at_signal?: string;
  signal_delay_seconds?: number;
  conflicting_with_train?: string;
  halt_reason?: string;
  signals_passed: string[];
  next_signal: string;
}

export interface EventData {
  event_id: string;
  event_type: "SIGNAL_BLOCK" | "TRACK_MAINTENANCE" | "EQUIPMENT_FAILURE" | "WEATHER_DELAY" | "EMERGENCY_STOP";
  section_id: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  start_timestamp: string;
  estimated_end_timestamp: string;
  affected_train_ids: string[];
}

export interface SignalConflictData {
  conflict_id: string;
  signal_id: string;
  section_id: string;
  halted_trains: string[];
  conflicting_trains: string[];
  halt_reason: string;
  train_position_meters: number;
}

export interface WebSocketMessage {
  message_type: "train_state" | "event" | "signal_conflict";
  timestamp: string;
  train_data?: TrainData;
  event_data?: EventData;
  conflict_data?: SignalConflictData;
}

export interface OptimizationRequest {
  trains: {
    train_id: string;
    current_section: string;
    destination: string;
    priority: number;
    delay_minutes: number;
    train_type: string;
  }[];
  disruptions?: {
    section_id: string;
    event_type: string;
    severity: string;
    duration_minutes: number;
  }[];
  optimization_criteria: string[];
}

export interface OptimizationCandidate {
  candidate_id: string;
  algorithm: string;
  score: number;
  estimated_improvement_minutes: number;
  modifications: {
    train_id: string;
    action: string;
    new_route?: string[];
    estimated_delay_reduction: number;
  }[];
}

export interface OptimizationResponse {
  optimization_id: string;
  timestamp: string;
  candidates: OptimizationCandidate[];
  summary: {
    total_candidates: number;
    best_score: number;
    average_improvement: number;
  };
}
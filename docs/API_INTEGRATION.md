# Railway System API Integration

## Frontend Integration Guide

### Overview
This document outlines how the frontend integrates with the Railway System API to provide real-time train monitoring and AI-powered optimization recommendations.

## Backend Requirements

### 1. Train Simulator (WebSocket Server)
```bash
# Start the WebSocket server for real-time data
python train_simulator.py --port 8765
```
- **URL**: `ws://localhost:8765`
- **Purpose**: Streams real-time train positions, status updates, and events

### 2. Optimizer Service (REST API)
```bash
# Start the optimization service
python optimizer_service.py --port 8081
```
- **URL**: `http://localhost:8081`
- **Purpose**: Provides AI-powered scheduling optimization

## Frontend Components

### 1. WebSocket Integration (`useWebSocket` hook)
```typescript
const { trains, events, conflicts, connectionStatus, reconnect } = useWebSocket();
```

**Features:**
- Automatic reconnection on connection loss
- Real-time train position updates
- Event and conflict notifications
- Connection status monitoring

### 2. Track Visualization (`TrackVisualization` component)
- Live train animation based on real position data
- Multiple railway sections with stations
- Train status indicators (running, delayed, holding, stopped)
- Speed and delay information display

### 3. AI Recommendations (`AIRecommendationsPanel` component)
- Accept/Reject functionality for optimization suggestions
- Priority-based recommendation display
- Real-time optimization request capability
- Action history tracking

## API Endpoints Used

### WebSocket Messages
```typescript
// Train state updates
{
  "message_type": "train_state",
  "train_data": {
    "train_id": "T001",
    "current_section_id": "S05",
    "position_in_section_meters": 1250.5,
    "speed_kmh": 85.3,
    "status": "RUNNING"
    // ... more fields
  }
}

// Events and disruptions
{
  "message_type": "event",
  "event_data": {
    "event_type": "SIGNAL_BLOCK",
    "section_id": "S12",
    "severity": "HIGH"
    // ... more fields
  }
}
```

### REST API Calls
```typescript
// Request optimization
POST /optimize
{
  "trains": [...],
  "optimization_criteria": ["minimize_delays", "maximize_throughput"]
}

// Accept recommendation
POST /optimizations/{id}/accept
{
  "candidate_id": "CAND_001"
}

// Reject recommendation  
POST /optimizations/{id}/reject
{
  "candidate_id": "CAND_001",
  "reason": "Operational constraints"
}
```

## Configuration

### Development Setup
1. Ensure backend services are running:
   - WebSocket simulator on port 8765
   - Optimizer service on port 8081

2. Frontend will automatically attempt to connect to:
   - `ws://localhost:8765` for real-time data
   - `http://localhost:8081` for optimization requests

### Production Configuration
Update the service URLs in:
- `src/hooks/useWebSocket.ts` - WebSocket URL
- `src/services/railwayApi.ts` - REST API base URL

## Error Handling

### Connection Issues
- WebSocket automatically reconnects on disconnection
- Connection status displayed in header
- Manual reconnect button available when offline

### API Failures
- Toast notifications for failed operations
- Graceful fallback to mock data when backend unavailable
- Timeout handling for optimization requests

## Data Flow

1. **Real-time Updates**: WebSocket streams train positions → `useWebSocket` hook → `TrackVisualization` component
2. **Optimization Requests**: User clicks optimize → API call to `/optimize` → Candidates displayed in recommendations panel
3. **Decision Actions**: User accepts/rejects → API calls to accept/reject endpoints → Status updates in UI

## Performance Considerations

- WebSocket messages processed at 1-second intervals
- Train position animations use CSS transitions for smooth movement
- Component re-renders optimized with React.memo and useMemo
- API calls debounced to prevent excessive requests

## Security Notes

- No authentication required in development mode
- CORS configured for local development
- Error messages sanitized before display
- Input validation on all API requests
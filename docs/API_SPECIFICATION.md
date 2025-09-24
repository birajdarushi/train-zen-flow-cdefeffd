# Railway System API Specification

## Overview
The Railway System provides real-time train operations data through WebSocket streaming and optimization services through REST API endpoints.

## Architecture Components

### 1. Train Simulator (WebSocket Server)
- **Purpose**: Real-time train operations streaming
- **Protocol**: WebSocket
- **Default Port**: 8765
- **URL**: `ws://localhost:8765`

### 2. Optimizer Service (REST API)
- **Purpose**: AI-powered train scheduling optimization
- **Protocol**: HTTP REST
- **Default Port**: 8081
- **Base URL**: `http://localhost:8081`

---

## WebSocket API (Train Simulator)

### Connection
```javascript
const ws = new WebSocket('ws://localhost:8765');
```

### Message Types

#### 1. Train State Messages
**Message Type**: `train_state`

```json
{
  "message_type": "train_state",
  "timestamp": "2025-09-25T01:32:16.123456Z",
  "train_data": {
    "train_id": "T001",
    "train_type": "PASSENGER",
    "status": "RUNNING",
    "current_section_id": "S05",
    "position_in_section_meters": 1250.5,
    "speed_kmh": 85.3,
    "destination": "S18",
    "priority": 1,
    "precedence_rank": 3,
    "eta_to_section_exit": 145.2,
    "expected_exit_timestamp": "2025-09-25T01:34:41.345Z",
    "delayed_at_signal": "SIG_051",
    "signal_delay_seconds": 45,
    "conflicting_with_train": "T007",
    "halt_reason": "track_capacity_exceeded",
    "signals_passed": ["SIG_049", "SIG_050"],
    "next_signal": "SIG_052"
  }
}
```

#### 2. Event Messages
**Message Type**: `event`

```json
{
  "message_type": "event",
  "timestamp": "2025-09-25T01:32:16.123456Z",
  "event_data": {
    "event_id": "EVT_001",
    "event_type": "SIGNAL_BLOCK",
    "section_id": "S12",
    "description": "Signal failure on main line",
    "severity": "HIGH",
    "start_timestamp": "2025-09-25T01:32:16.123456Z",
    "estimated_end_timestamp": "2025-09-25T01:42:16.123456Z",
    "affected_train_ids": ["T003", "T007"]
  }
}
```

#### 3. Signal Conflict Messages
**Message Type**: `signal_conflict`

```json
{
  "message_type": "signal_conflict",
  "timestamp": "2025-09-25T01:32:16.123456Z",
  "conflict_data": {
    "conflict_id": "CONF_001",
    "signal_id": "SIG_167",
    "section_id": "S15",
    "halted_trains": ["T008"],
    "conflicting_trains": ["T008", "T002"],
    "halt_reason": "track_capacity_exceeded",
    "train_position_meters": 850.3
  }
}
```

### Train Status Enum Values
- `RUNNING`: Train is moving normally
- `DELAYED`: Train is behind schedule
- `HOLDING`: Train is stopped due to conflicts
- `STOPPED`: Train has reached destination

### Train Type Enum Values
- `PASSENGER`: Passenger service
- `FREIGHT`: Freight/cargo service
- `EXPRESS`: High-speed express service

### Event Type Enum Values
- `SIGNAL_BLOCK`: Signal system failure
- `TRACK_MAINTENANCE`: Scheduled maintenance
- `EQUIPMENT_FAILURE`: Train equipment issues
- `WEATHER_DELAY`: Weather-related delays
- `EMERGENCY_STOP`: Emergency situations

### Event Severity Enum Values
- `LOW`: Minor impact
- `MEDIUM`: Moderate impact
- `HIGH`: Major impact
- `CRITICAL`: Severe impact

---

## REST API (Optimizer Service)

### Base URL
```
http://localhost:8081
```

### Authentication
Currently no authentication required (development mode)

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-25T01:32:16.123456Z",
  "version": "1.0.0"
}
```

#### 2. Generate Optimization
```http
POST /optimize
```

**Request Body**:
```json
{
  "trains": [
    {
      "train_id": "T001",
      "current_section": "S05",
      "destination": "S18",
      "priority": 1,
      "delay_minutes": 15,
      "train_type": "PASSENGER"
    }
  ],
  "disruptions": [
    {
      "section_id": "S12",
      "event_type": "SIGNAL_BLOCK",
      "severity": "HIGH",
      "duration_minutes": 30
    }
  ],
  "optimization_criteria": ["minimize_delays", "maximize_throughput"]
}
```

**Response**:
```json
{
  "optimization_id": "OPT_001",
  "timestamp": "2025-09-25T01:32:16.123456Z",
  "candidates": [
    {
      "candidate_id": "CAND_001",
      "algorithm": "tabu_search",
      "score": 0.89,
      "estimated_improvement_minutes": 12,
      "modifications": [
        {
          "train_id": "T001",
          "action": "reroute",
          "new_route": ["S05", "S07", "S18"],
          "estimated_delay_reduction": 8
        }
      ]
    }
  ],
  "summary": {
    "total_candidates": 3,
    "best_score": 0.89,
    "average_improvement": 10.5
  }
}
```

#### 3. Get Optimization History
```http
GET /optimizations?limit=10&offset=0
```

**Response**:
```json
{
  "optimizations": [
    {
      "optimization_id": "OPT_001",
      "timestamp": "2025-09-25T01:32:16.123456Z",
      "status": "completed",
      "best_candidate": {
        "candidate_id": "CAND_001",
        "score": 0.89
      }
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

---

## Integration Patterns

### 1. Real-time Dashboard
```javascript
// Connect to WebSocket for real-time updates
const ws = new WebSocket('ws://localhost:8765');

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  switch(data.message_type) {
    case 'train_state':
      updateTrainPosition(data.train_data);
      break;
    case 'event':
      showEventAlert(data.event_data);
      break;
    case 'signal_conflict':
      highlightSignalConflict(data.conflict_data);
      break;
  }
};
```

### 2. Optimization Trigger
```javascript
// When delays exceed threshold, request optimization
async function requestOptimization(trainData) {
  const response = await fetch('http://localhost:8081/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      trains: trainData,
      optimization_criteria: ['minimize_delays']
    })
  });
  
  const optimization = await response.json();
  return optimization.candidates;
}
```

---

## Error Handling

### WebSocket Errors
```javascript
ws.onerror = function(error) {
  console.error('WebSocket error:', error);
  // Implement reconnection logic
};

ws.onclose = function(event) {
  if (event.wasClean) {
    console.log('Connection closed cleanly');
  } else {
    console.error('Connection died');
    // Attempt to reconnect
  }
};
```

### REST API Errors
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid train data provided",
    "details": {
      "field": "train_id",
      "issue": "Train ID cannot be empty"
    }
  },
  "timestamp": "2025-09-25T01:32:16.123456Z"
}
```

### HTTP Status Codes
- `200 OK`: Successful request
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service temporarily unavailable

---

## Sample Frontend Integration

### React Example
```jsx
import React, { useState, useEffect } from 'react';

function TrainDashboard() {
  const [trains, setTrains] = useState({});
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.message_type === 'train_state') {
        setTrains(prev => ({
          ...prev,
          [data.train_data.train_id]: data.train_data
        }));
      } else if (data.message_type === 'event') {
        setEvents(prev => [data.event_data, ...prev.slice(0, 9)]);
      }
    };
    
    return () => ws.close();
  }, []);
  
  const handleOptimize = async () => {
    const trainData = Object.values(trains).map(train => ({
      train_id: train.train_id,
      current_section: train.current_section_id,
      destination: train.destination,
      priority: train.priority,
      delay_minutes: Math.floor(train.signal_delay_seconds / 60),
      train_type: train.train_type
    }));
    
    const response = await fetch('http://localhost:8081/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trains: trainData })
    });
    
    const optimization = await response.json();
    console.log('Optimization suggestions:', optimization.candidates);
  };
  
  return (
    <div>
      <h1>Railway Control System</h1>
      <button onClick={handleOptimize}>Optimize Schedule</button>
      
      <div className="trains">
        {Object.values(trains).map(train => (
          <TrainCard key={train.train_id} train={train} />
        ))}
      </div>
      
      <div className="events">
        {events.map((event, i) => (
          <EventAlert key={i} event={event} />
        ))}
      </div>
    </div>
  );
}
```

---

## Configuration

### Simulator Startup Options
```bash
# Basic startup
python train_simulator.py

# Custom configuration
python train_simulator.py \
  --trains 12 \
  --sections 25 \
  --scenario peak \
  --port 8765 \
  --auto-stop \
  --interval 0.5
```

### Optimizer Service Startup
```bash
# Start optimizer service
python optimizer_service.py --port 8081
```

---

## Data Persistence

### NDJSON Log Files
- **File**: `train_simulation.ndjson`
- **Format**: Newline-delimited JSON
- **Content**: All WebSocket messages for historical analysis

### Example Log Entry
```json
{"message_type": "train_state", "timestamp": "2025-09-25T01:32:16.123456Z", "train_data": {"train_id": "T001", "status": "RUNNING", "speed_kmh": 85.3}}
```

---

## Rate Limits and Performance

### WebSocket
- **Update Frequency**: 1 second intervals (configurable)
- **Message Size**: ~500 bytes per train state
- **Concurrent Connections**: No limit (development mode)

### REST API
- **Rate Limit**: No limits (development mode)
- **Timeout**: 30 seconds for optimization requests
- **Max Payload**: 10MB

---

## Development and Testing

### Local Development URLs
- **Simulator WebSocket**: `ws://localhost:8765`
- **Optimizer API**: `http://localhost:8081`
- **Health Check**: `http://localhost:8081/health`

### Test Client
```bash
# Test WebSocket connection
python client.py --output received_messages.ndjson

# Test REST API
curl -X GET http://localhost:8081/health
curl -X POST http://localhost:8081/optimize -H "Content-Type: application/json" -d @sample_request.json
```

This specification provides everything needed to integrate your railway system with a frontend application!
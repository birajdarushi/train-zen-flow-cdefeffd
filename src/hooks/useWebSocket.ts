import { useEffect, useState, useCallback } from 'react';
import { WebSocketMessage, TrainData, EventData, SignalConflictData } from '@/types/railway';

interface UseWebSocketReturn {
  trains: Record<string, TrainData>;
  events: EventData[];
  conflicts: SignalConflictData[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  reconnect: () => void;
}

export function useWebSocket(url: string = 'ws://localhost:8765'): UseWebSocketReturn {
  const [trains, setTrains] = useState<Record<string, TrainData>>({});
  const [events, setEvents] = useState<EventData[]>([]);
  const [conflicts, setConflicts] = useState<SignalConflictData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      setConnectionStatus('connecting');
      const websocket = new WebSocket(url);

      websocket.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
      };

      websocket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          switch (data.message_type) {
            case 'train_state':
              if (data.train_data) {
                setTrains(prev => ({
                  ...prev,
                  [data.train_data!.train_id]: data.train_data!
                }));
              }
              break;
            
            case 'event':
              if (data.event_data) {
                setEvents(prev => [data.event_data!, ...prev.slice(0, 9)]);
              }
              break;
            
            case 'signal_conflict':
              if (data.conflict_data) {
                setConflicts(prev => [data.conflict_data!, ...prev.slice(0, 4)]);
              }
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

      websocket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Auto-reconnect after 3 seconds if not intentionally closed
        if (!event.wasClean) {
          setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      setWs(websocket);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionStatus('error');
    }
  }, [url]);

  const reconnect = useCallback(() => {
    if (ws) {
      ws.close();
    }
    connect();
  }, [ws, connect]);

  useEffect(() => {
    connect();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  return {
    trains,
    events,
    conflicts,
    connectionStatus,
    reconnect,
  };
}
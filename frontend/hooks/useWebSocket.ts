import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_BASE_URL, INITIAL_RECONNECT_DELAY, MAX_RECONNECT_DELAY } from '../constants';
import { ConnectionStatus, WSMessage } from '../types';

interface UseWebSocketReturn {
  status: ConnectionStatus;
  connectGlobal: () => void;
  subscribeMatch: (matchId: string | number) => void;
  unsubscribeMatch: (matchId: string | number) => void;
  disconnect: () => void;
}

export const useWebSocket = (
  onMessage: (msg: WSMessage) => void
): UseWebSocketReturn => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const isIntentionalClose = useRef(false);
  const subscribedMatchIdsRef = useRef(new Set<string>());

  const normalizeId = (matchId: string | number) => String(matchId);
  const parseMatchId = (matchId: string | number): number | null => {
    if (typeof matchId === 'number' && Number.isInteger(matchId)) return matchId;
    if (typeof matchId === 'string' && /^\d+$/.test(matchId)) return Number(matchId);
    return null;
  };

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: WSMessage | Record<string, unknown>) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  // Core connect function
  const initConnection = useCallback(() => {
    clearReconnectTimer();

    if (ws.current) {
      isIntentionalClose.current = true;
      ws.current.close();
      ws.current = null;
    }

    setStatus(reconnectAttempts.current > 0 ? 'reconnecting' : 'connecting');
    isIntentionalClose.current = false;

    try {
      const socket = new WebSocket(WS_BASE_URL);
      ws.current = socket;

      socket.onopen = () => {
        if (ws.current !== socket) return;

        setStatus('connected');
        reconnectAttempts.current = 0;

        if (subscribedMatchIdsRef.current.size > 0) {
          subscribedMatchIdsRef.current.forEach((matchId) => {
            const parsedMatchId = parseMatchId(matchId);
            if (parsedMatchId === null) return;

            socket.send(JSON.stringify({ type: 'subscribe', matchId: parsedMatchId }));
          });
        }

        console.log('[WebSocket] Connected successfully');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('[WebSocket] Failed to parse message:', e);
        }
      };

      socket.onerror = () => {
        if (ws.current !== socket) return;

        // WebSocket error events are generic in browsers and don't contain descriptive messages.
        // We log it to indicate an issue occurred.
        console.warn('[WebSocket] Connection error occurred');

        // Only set error status if we were connected; otherwise let onclose handle it
        if (ws.current?.readyState === WebSocket.OPEN) {
          setStatus('error');
        }
      };

      socket.onclose = (event) => {
        if (ws.current !== socket) return;

        ws.current = null;
        if (!isIntentionalClose.current) {
          setStatus('disconnected');

          const delay = Math.min(
            INITIAL_RECONNECT_DELAY * (2 ** reconnectAttempts.current),
            MAX_RECONNECT_DELAY
          );

          console.log(`[WebSocket] Disconnected (Code: ${event.code}). Reconnecting in ${delay}ms...`);

          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            initConnection();
          }, delay);
        } else {
          setStatus('disconnected');
        }
      };

    } catch (e) {
      console.error('[WebSocket] Connection creation failed:', e);
      setStatus('error');
    }
  }, [clearReconnectTimer, onMessage]);

  // Public connect method
  const connectGlobal = useCallback(() => {
    isIntentionalClose.current = false;
    clearReconnectTimer();
    reconnectAttempts.current = 0;

    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    initConnection();
  }, [clearReconnectTimer, initConnection]);

  const subscribeMatch = useCallback((matchId: string | number) => {
    const normalized = normalizeId(matchId);
    subscribedMatchIdsRef.current.add(normalized);

    const parsedMatchId = parseMatchId(matchId);
    if (parsedMatchId === null) return;

    sendMessage({ type: 'subscribe', matchId: parsedMatchId });
  }, [sendMessage]);

  const unsubscribeMatch = useCallback((matchId: string | number) => {
    const normalized = normalizeId(matchId);
    subscribedMatchIdsRef.current.delete(normalized);

    const parsedMatchId = parseMatchId(matchId);
    if (parsedMatchId === null) return;

    sendMessage({ type: 'unsubscribe', matchId: parsedMatchId });
  }, [sendMessage]);

  // Public disconnect method
  const disconnect = useCallback(() => {
    isIntentionalClose.current = true;
    clearReconnectTimer();

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    setStatus('disconnected');
  }, [clearReconnectTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isIntentionalClose.current = true;
      clearReconnectTimer();
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [clearReconnectTimer]);

  return { status, connectGlobal, subscribeMatch, unsubscribeMatch, disconnect };
};

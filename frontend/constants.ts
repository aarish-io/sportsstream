const DEFAULT_API_BASE_URL = "http://localhost:8000";
const DEFAULT_WS_BASE_URL = "ws://localhost:8000/ws";

const normalizeWsUrl = (value: string) =>
  value.endsWith('/ws') ? value : `${value.replace(/\/$/, '')}/ws`;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  DEFAULT_API_BASE_URL;
export const WS_BASE_URL =
  normalizeWsUrl(
    import.meta.env.VITE_WS_BASE_URL ||
    import.meta.env.VITE_WS_URL ||
    DEFAULT_WS_BASE_URL
  );

// Exponential backoff configuration
export const MAX_RECONNECT_DELAY = 30000; // 30 seconds
export const INITIAL_RECONNECT_DELAY = 1000; // 1 second

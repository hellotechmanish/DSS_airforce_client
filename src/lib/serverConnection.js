import { FETCH_URL } from "../fetchIp";

const DEFAULT_STATUS = "checking";
const DEFAULT_RETRY_INTERVAL = 5000;
const DEFAULT_TIMEOUT = 4000;
const NETWORK_ERROR_CODES = new Set(["ERR_NETWORK", "ECONNABORTED"]);

let connectionState = {
  status: DEFAULT_STATUS,
  lastCheckedAt: null,
  lastError: "",
};

let activeProbe = null;
const listeners = new Set();

const emitChange = (nextState) => {
  connectionState = {
    ...connectionState,
    ...nextState,
  };

  listeners.forEach((listener) => listener(connectionState));
};

const getBaseUrl = () => process.env.REACT_APP_API_URL || FETCH_URL;

const buildHealthcheckUrl = () => {
  const baseUrl = getBaseUrl();
  const healthcheckPath = process.env.REACT_APP_SERVER_HEALTHCHECK_PATH;

  if (!healthcheckPath) {
    return baseUrl;
  }

  return new URL(healthcheckPath, baseUrl).toString();
};

export const getServerConnectionState = () => connectionState;

export const subscribeToServerConnection = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const markServerAvailable = () => {
  emitChange({
    status: "up",
    lastCheckedAt: Date.now(),
    lastError: "",
  });
};

export const markServerUnavailable = (error) => {
  emitChange({
    status: "down",
    lastCheckedAt: Date.now(),
    lastError: error?.message || "Unable to reach the backend server.",
  });
};

export const setServerChecking = () => {
  emitChange({
    status: "checking",
  });
};

export const isServerUnavailableError = (error) => {
  if (!error || error.response) {
    return false;
  }

  const message = String(error.message || "").toLowerCase();

  return (
    NETWORK_ERROR_CODES.has(error.code) ||
    message.includes("network error") ||
    message.includes("failed to fetch") ||
    message.includes("load failed") ||
    message.includes("timeout")
  );
};

export const holdRequestUntilReconnect = () => new Promise(() => {});

export const probeServerConnection = async () => {
  if (activeProbe) {
    return activeProbe;
  }

  setServerChecking();

  activeProbe = new Promise(async (resolve) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      await fetch(buildHealthcheckUrl(), {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });

      markServerAvailable();
      resolve(true);
    } catch (error) {
      markServerUnavailable(error);
      resolve(false);
    } finally {
      window.clearTimeout(timeoutId);
      activeProbe = null;
    }
  });

  return activeProbe;
};

export const getServerRetryInterval = () => DEFAULT_RETRY_INTERVAL;

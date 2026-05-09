export const CALL_STATES = Object.freeze({
  IDLE: "idle",
  OUTGOING: "outgoing",
  INCOMING: "incoming",
  CONNECTING: "connecting",
  ACTIVE: "active",
  MINIMIZED: "minimized",
  ENDING: "ending",
  ERROR: "error",
});

export const CALL_ERROR_MESSAGES = Object.freeze({
  CALL_ALREADY_ACTIVE: "A call is already active.",
  USER_BUSY: "The other person is busy on another call.",
  DUPLICATE_REQUEST: "A call request is already waiting.",
  CALL_LOCKED: "This call is being updated. Please wait a moment.",
});

export const BUSY_CALL_STATES = new Set([
  CALL_STATES.OUTGOING,
  CALL_STATES.INCOMING,
  CALL_STATES.CONNECTING,
  CALL_STATES.ACTIVE,
  CALL_STATES.MINIMIZED,
  CALL_STATES.ENDING,
]);

export const BLOCKING_MODAL_STATES = new Set([
  CALL_STATES.OUTGOING,
  CALL_STATES.INCOMING,
  CALL_STATES.CONNECTING,
  CALL_STATES.ACTIVE,
  CALL_STATES.ENDING,
  CALL_STATES.ERROR,
]);

export const initialCallState = {
  status: CALL_STATES.IDLE,
  consultationId: null,
  peerName: "",
  error: "",
  errorCode: "",
  reconnecting: false,
  controlsLocked: false,
  startedAt: null,
  endedAt: null,
};

export const isCallBusy = (status) => BUSY_CALL_STATES.has(status);

export const getCallLabel = (callState) => {
  if (callState.status === CALL_STATES.OUTGOING) return "Calling...";
  if (callState.status === CALL_STATES.INCOMING) return "Incoming call";
  if (callState.status === CALL_STATES.CONNECTING) return "Connecting...";
  if (callState.status === CALL_STATES.ACTIVE) {
    return callState.reconnecting ? "Reconnecting..." : "Live call";
  }
  if (callState.status === CALL_STATES.MINIMIZED) {
    return callState.reconnecting ? "Reconnecting..." : "Live call";
  }
  if (callState.status === CALL_STATES.ENDING) return "Call ended";
  if (callState.status === CALL_STATES.ERROR) return "Call failed";
  return "Ready";
};

export const getFriendlyCallError = (codeOrMessage) => {
  if (!codeOrMessage) return "Call failed. Please try again.";
  return CALL_ERROR_MESSAGES[codeOrMessage] || codeOrMessage;
};

export function callReducer(state, action) {
  switch (action.type) {
    case "START_OUTGOING":
      if (isCallBusy(state.status)) return state;
      return {
        ...initialCallState,
        status: CALL_STATES.OUTGOING,
        consultationId: action.consultationId,
        peerName: action.peerName || "",
      };

    case "INCOMING":
      if (isCallBusy(state.status)) return state;
      return {
        ...initialCallState,
        status: CALL_STATES.INCOMING,
        consultationId: action.consultationId,
        peerName: action.peerName || "",
      };

    case "LOCK_CONTROLS":
      return { ...state, controlsLocked: true };

    case "UNLOCK_CONTROLS":
      return { ...state, controlsLocked: false };

    case "CONNECTING":
      if (
        state.status !== CALL_STATES.OUTGOING &&
        state.status !== CALL_STATES.INCOMING &&
        state.status !== CALL_STATES.ERROR
      ) {
        return state;
      }
      return {
        ...state,
        status: CALL_STATES.CONNECTING,
        controlsLocked: Boolean(action.controlsLocked),
        error: "",
        errorCode: "",
      };

    case "CONNECTED":
      if (
        state.status !== CALL_STATES.CONNECTING &&
        state.status !== CALL_STATES.OUTGOING &&
        state.status !== CALL_STATES.INCOMING &&
        state.status !== CALL_STATES.MINIMIZED
      ) {
        return state;
      }
      return {
        ...state,
        status:
          state.status === CALL_STATES.MINIMIZED
            ? CALL_STATES.MINIMIZED
            : CALL_STATES.ACTIVE,
        controlsLocked: false,
        reconnecting: false,
        startedAt: state.startedAt || new Date().toISOString(),
      };

    case "RECONNECTING":
      if (
        state.status !== CALL_STATES.ACTIVE &&
        state.status !== CALL_STATES.MINIMIZED
      ) {
        return state;
      }
      return { ...state, reconnecting: true };

    case "MINIMIZE":
      if (state.status !== CALL_STATES.ACTIVE) return state;
      return { ...state, status: CALL_STATES.MINIMIZED };

    case "RESTORE":
      if (state.status !== CALL_STATES.MINIMIZED) return state;
      return { ...state, status: CALL_STATES.ACTIVE };

    case "ENDING":
      if (state.status === CALL_STATES.IDLE) return state;
      return { ...state, status: CALL_STATES.ENDING, controlsLocked: true };

    case "ENDED":
      return {
        ...initialCallState,
        endedAt: new Date().toISOString(),
      };

    case "ERROR":
      return {
        ...state,
        status: CALL_STATES.ERROR,
        controlsLocked: false,
        reconnecting: false,
        errorCode: action.code || "",
        error: getFriendlyCallError(action.message || action.code),
      };

    default:
      return state;
  }
}

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:5001/api";
export const API_BASE_URL = BASE_URL;
const ASSET_URL = BASE_URL.replace(/\/api\/?$/, "");
const GET_CACHE_TTL_MS = 60_000;
const PERSISTED_CACHE_TTL_MS = 30 * 60_000;
const QUERY_CACHE_STORAGE_KEY = "ml_query_cache_v1";
const PRESCRIPTION_CACHE_STORAGE_KEY = "ml_prescription_cache_v1";
const LAST_PRESCRIPTION_ID_STORAGE_KEY = "ml_last_prescription_id";
const getCache = new Map();
let refreshPromise = null;

const getToken = () => localStorage.getItem("ml_token");
const setToken = (t) => localStorage.setItem("ml_token", t);
const setRefreshToken = (t) => localStorage.setItem("ml_refresh", t);
const getRefreshToken = () => localStorage.getItem("ml_refresh");

const canUseStorage = () => typeof localStorage !== "undefined";

const readStorageJson = (key, fallback) => {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorageJson = (key, value) => {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const removeStorageKey = (key) => {
  if (!canUseStorage()) return;
  try {
    localStorage.removeItem(key);
  } catch {}
};

const readPersistedQueryCache = (cacheKey) => {
  const store = readStorageJson(QUERY_CACHE_STORAGE_KEY, {});
  const entry = store?.[cacheKey];
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    delete store[cacheKey];
    writeStorageJson(QUERY_CACHE_STORAGE_KEY, store);
    return null;
  }
  return entry.data;
};

const writePersistedQueryCache = (cacheKey, data, ttlMs) => {
  const store = readStorageJson(QUERY_CACHE_STORAGE_KEY, {});
  store[cacheKey] = {
    data,
    expiresAt: Date.now() + ttlMs,
  };
  writeStorageJson(QUERY_CACHE_STORAGE_KEY, store);
};

const clearPersistedQueryCache = () => removeStorageKey(QUERY_CACHE_STORAGE_KEY);

const readPrescriptionStore = () =>
  readStorageJson(PRESCRIPTION_CACHE_STORAGE_KEY, {
    items: {},
    expiresAt: 0,
  });

const writePrescriptionStore = (store) =>
  writeStorageJson(PRESCRIPTION_CACHE_STORAGE_KEY, store);

export const clearTokens = () => {
  localStorage.removeItem("ml_token");
  localStorage.removeItem("ml_refresh");
  localStorage.removeItem("ml_user");
  getCache.clear();
  clearPersistedQueryCache();
  removeStorageKey(PRESCRIPTION_CACHE_STORAGE_KEY);
  removeStorageKey(LAST_PRESCRIPTION_ID_STORAGE_KEY);
};

const redirectToLogin = () => {
  clearTokens();
  if (typeof window !== "undefined") window.location.reload();
};

const parseResponse = async (res) => {
  if (res.status === 204) return {};

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  if (!text) return {};

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  return { message: text };
};

const withCacheBust = (path) => {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}_mlcb=${Date.now()}`;
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("Missing refresh token");

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        const data = await parseResponse(res);
        if (!res.ok) {
          throw new Error(data.message || "Session refresh failed");
        }
        setToken(data.data.token);
        setRefreshToken(data.data.refreshToken);
        return data.data.token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

async function send(path, options = {}) {
  const { skipAuth = false, ...fetchOptions } = options;
  const token = getToken();
  const method = (fetchOptions.method || "GET").toUpperCase();
  const isFormData =
    typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;
  const headers = isFormData
    ? { ...fetchOptions.headers }
    : { "Content-Type": "application/json", ...fetchOptions.headers };
  if (method === "GET") {
    headers["Cache-Control"] = "no-cache";
    headers.Pragma = "no-cache";
  }
  if (token && !skipAuth) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
    cache: "no-store",
  });

  if (method === "GET" && res.status === 304) {
    res = await fetch(`${BASE_URL}${withCacheBust(path)}`, {
      ...fetchOptions,
      headers,
      cache: "reload",
    });
  }

  if (
    res.status === 401 &&
    !skipAuth &&
    !path.includes("/auth/") &&
    getRefreshToken()
  ) {
    try {
      const nextToken = await refreshAccessToken();
      headers["Authorization"] = `Bearer ${nextToken}`;
      res = await fetch(`${BASE_URL}${path}`, {
        ...fetchOptions,
        headers,
        cache: "no-store",
      });
    } catch {
      redirectToLogin();
      throw new Error("Session expired. Please log in again.");
    }
  }

  const data = await parseResponse(res);
  if (!res.ok) {
    const detail = Array.isArray(data.errors)
      ? data.errors
          .map((item) => item.msg)
          .filter(Boolean)
          .join(", ")
      : "";
    throw new Error(detail || data.message || `Error ${res.status}`);
  }
  return data;
}

async function req(path, options = {}) {
  const {
    cachePolicy = "memory",
    cacheTtlMs,
    ...requestOptions
  } = options;
  const ttlMs =
    cacheTtlMs ??
    (cachePolicy === "persist" ? PERSISTED_CACHE_TTL_MS : GET_CACHE_TTL_MS);
  const method = (requestOptions.method || "GET").toUpperCase();
  const isGet = method === "GET";
  const cacheScope = requestOptions.skipAuth ? "public" : getToken() || "anon";
  const cacheKey = `${cacheScope}:${path}`;
  const shouldPersist = cachePolicy === "persist";

  if (isGet) {
    const cached = getCache.get(cacheKey);
    if (cached?.data && cached.expiresAt > Date.now()) return cached.data;
    if (cached?.promise) return cached.promise;
    if (shouldPersist) {
      const persisted = readPersistedQueryCache(cacheKey);
      if (persisted) {
        getCache.set(cacheKey, {
          data: persisted,
          expiresAt: Date.now() + ttlMs,
        });
        return persisted;
      }
    }

    const promise = send(path, requestOptions)
      .then((data) => {
        getCache.set(cacheKey, {
          data,
          expiresAt: Date.now() + ttlMs,
        });
        if (shouldPersist) {
          writePersistedQueryCache(cacheKey, data, ttlMs);
        }
        return data;
      })
      .catch((err) => {
        getCache.delete(cacheKey);
        throw err;
      });

    getCache.set(cacheKey, {
      promise,
      expiresAt: Date.now() + ttlMs,
    });
    return promise;
  }

  const data = await send(path, requestOptions);
  getCache.clear();
  clearPersistedQueryCache();
  removeStorageKey(PRESCRIPTION_CACHE_STORAGE_KEY);
  return data;
}

export const resolveAssetUrl = (path) => {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  const normalized = String(path).replace(/\\/g, "/");
  return `${ASSET_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
};

export const prescriptionCache = {
  getById: (id) => {
    if (!id) return null;
    const store = readPrescriptionStore();
    if (store.expiresAt <= Date.now()) {
      removeStorageKey(PRESCRIPTION_CACHE_STORAGE_KEY);
      return null;
    }
    return store.items?.[id] || null;
  },
  saveItem: (item) => {
    if (!item?._id) return;
    const store = readPrescriptionStore();
    const nextItems =
      store.expiresAt > Date.now() && store.items ? { ...store.items } : {};
    nextItems[item._id] = item;
    writePrescriptionStore({
      items: nextItems,
      expiresAt: Date.now() + PERSISTED_CACHE_TTL_MS,
    });
  },
  saveList: (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return;
    const store = readPrescriptionStore();
    const nextItems =
      store.expiresAt > Date.now() && store.items ? { ...store.items } : {};
    items.forEach((item) => {
      if (item?._id) nextItems[item._id] = item;
    });
    writePrescriptionStore({
      items: nextItems,
      expiresAt: Date.now() + PERSISTED_CACHE_TTL_MS,
    });
  },
  clear: () => removeStorageKey(PRESCRIPTION_CACHE_STORAGE_KEY),
};

export const prescriptionSelection = {
  get: () => readStorageJson(LAST_PRESCRIPTION_ID_STORAGE_KEY, ""),
  set: (id) => {
    if (!id) return;
    writeStorageJson(LAST_PRESCRIPTION_ID_STORAGE_KEY, id);
  },
  clear: () => removeStorageKey(LAST_PRESCRIPTION_ID_STORAGE_KEY),
};

export const auth = {
  login: async (email, password) => {
    try {
      const d = await req("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(d.data.token);
      setRefreshToken(d.data.refreshToken);
      localStorage.setItem("ml_user", JSON.stringify(d.data.user));
      return d.data;
    } catch (err) {
      const message = String(err?.message || "");
      if (/verify your email/i.test(message)) {
        err.code = "EMAIL_NOT_VERIFIED";
      } else if (
        /pending admin verification/i.test(message) ||
        /account.*not verified/i.test(message)
      ) {
        err.code = "ACCOUNT_NOT_VERIFIED";
      } else if (/account is deactivated|account has been blocked/i.test(message)) {
        err.code = "ACCOUNT_BLOCKED";
      }
      throw err;
    }
  },
  register: async (payload) => {
    const d = await req("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const needsVerification =
      d.data?.requiresVerification ||
      d.data?.user?.isVerified === false ||
      d.data?.user?.emailVerified === false;
    if (d.data.token && !needsVerification) {
      setToken(d.data.token);
      setRefreshToken(d.data.refreshToken);
      localStorage.setItem("ml_user", JSON.stringify(d.data.user));
    }
    return d.data;
  },
  logout: async () => {
    try {
      await req("/auth/logout", { method: "POST" });
    } catch {}
    clearTokens();
  },
  getMe: () => req("/auth/me", { cachePolicy: "persist" }),
  updateMe: (d) =>
    req("/auth/me", {
      method: "PUT",
      body:
        typeof FormData !== "undefined" && d instanceof FormData
          ? d
          : JSON.stringify(d),
    }),
  requestVerification: (email) =>
    req("/auth/request-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  verifyEmail: (email, code) =>
    req("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    }),
  verifyEmailToken: (token) =>
    req(`/auth/verify-email/${encodeURIComponent(token)}`, {
      cacheTtlMs: 0,
      skipAuth: true,
    }),
  changePassword: (cur, nw) =>
    req("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: cur, newPassword: nw }),
    }),
  getSavedUser: () => {
    try {
      return JSON.parse(localStorage.getItem("ml_user"));
    } catch {
      return null;
    }
  },
  isLoggedIn: () => !!getToken(),
};

export const doctors = {
  getAll: (p = {}) =>
    req(`/doctors?${new URLSearchParams(p)}`, { cacheTtlMs: 0 }),
  getById: (id) => req(`/doctors/${id}`, { cacheTtlMs: 0 }),
  getBySpecialty: (s) =>
    req(`/doctors/specialty/${encodeURIComponent(s)}`, {
      cacheTtlMs: 0,
    }),
  getOwnProfile: () => req("/doctors/profile", { cachePolicy: "persist" }),
  updateProfile: (d) =>
    req("/doctors/profile", {
      method: "PUT",
      body:
        typeof FormData !== "undefined" && d instanceof FormData
          ? d
          : JSON.stringify(d),
    }),
  updateStatus: (online) =>
    req("/doctors/status", { method: "PUT", body: JSON.stringify({ online }) }),
  getDashboard: () => req("/doctors/dashboard", { cachePolicy: "persist" }),
  getConsultations: (p = {}) =>
    req(`/doctors/consultations?${new URLSearchParams(p)}`, {
      cachePolicy: "persist",
    }),
  getPatients: (p = {}) =>
    req(`/doctors/patients?${new URLSearchParams(p)}`, {
      cacheTtlMs: 15_000,
    }),
  addReview: (doctorId, review) =>
    req(`/doctors/${doctorId}/review`, { method: "POST", body: JSON.stringify(review) }),
};

export const vitals = {
  getForPatient: (patientId, p = {}) =>
    req(`/vitals/${patientId}?${new URLSearchParams(p)}`),
  addForPatient: (patientId, vital) =>
    req(`/vitals/${patientId}`, { method: "POST", body: JSON.stringify(vital) }),
  update: (id, vital) =>
    req(`/vitals/${id}`, { method: "PUT", body: JSON.stringify(vital) }),
  delete: (id) =>
    req(`/vitals/${id}`, { method: "DELETE" }),
};

export const reports = {
  getForPatient: (patientId, p = {}) =>
    req(`/reports/${patientId}?${new URLSearchParams(p)}`),
  addForPatient: (patientId, report) =>
    req(`/reports/${patientId}`, { method: "POST", body: JSON.stringify(report) }),
  update: (id, report) =>
    req(`/reports/${id}`, { method: "PUT", body: JSON.stringify(report) }),
  delete: (id) =>
    req(`/reports/${id}`, { method: "DELETE" }),
};

export const patients = {
  getProfile: () => req("/patients/profile", { cachePolicy: "persist" }),
  updateProfile: (d) =>
    req("/patients/profile", {
      method: "PUT",
      body:
        typeof FormData !== "undefined" && d instanceof FormData
          ? d
          : JSON.stringify(d),
    }),
  getDashboard: () => req("/patients/dashboard", { cachePolicy: "persist" }),
  getPrescriptions: (p = {}) =>
    req(`/patients/prescriptions?${new URLSearchParams(p)}`, {
      cachePolicy: "persist",
    }),
  getActivePrescriptions: () =>
    req("/patients/prescriptions/active", { cachePolicy: "persist" }),
  getPrescriptionById: (id) =>
    req(`/patients/prescriptions/${id}`, { cachePolicy: "persist" }),
  getConsultations: (p = {}) =>
    req(`/patients/consultations?${new URLSearchParams(p)}`, {
      cachePolicy: "persist",
    }),
  getReports: (p = {}) =>
    req(`/patients/reports?${new URLSearchParams(p)}`, {
      cacheTtlMs: 15_000,
    }),
  getVitals: (p = {}) =>
    req(`/patients/vitals?${new URLSearchParams(p)}`, {
      cacheTtlMs: 15_000,
    }),
};

export const admin = {
  getDashboard: () => req("/admin/dashboard", { cachePolicy: "persist" }),
  getUsers: (p = {}) =>
    req(`/admin/users?${new URLSearchParams(p)}`, { cachePolicy: "persist" }),
  getUserById: (id) =>
    req(`/admin/users/${id}`, { cachePolicy: "persist" }),
  verifyUser: (id, verified = true) =>
    req(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ isEmailVerified: verified }),
    }),
  verifyDoctor: (id, verified = true) =>
    req(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ doctorProfile: { isVerified: verified } }),
    }),
  updateUserStatus: (id, status) =>
    status === "active"
      ? req(`/admin/users/${id}/restore`, { method: "PUT" })
      : req(`/admin/users/${id}`, { method: "DELETE" }),
  getOrders: (p = {}) =>
    req(`/admin/orders?${new URLSearchParams(p)}`, {
      cachePolicy: "persist",
    }),
  updateOrderStatus: (id, statusOrPayload) =>
    req(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(
        typeof statusOrPayload === "string"
          ? { status: statusOrPayload }
          : statusOrPayload,
      ),
    }),
  getMedicines: (p = {}) =>
    req(`/admin/medicines?${new URLSearchParams(p)}`, {
      cachePolicy: "persist",
    }),
  createMedicine: (payload) =>
    req("/admin/medicines", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateMedicine: (id, payload) =>
    req(`/admin/medicines/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  archiveMedicine: (id) =>
    req(`/admin/medicines/${id}`, { method: "DELETE" }),
};

export const orders = {
  create: (payload) =>
    req("/orders", { method: "POST", body: JSON.stringify(payload) }),
  getAll: (p = {}) =>
    req(`/orders?${new URLSearchParams(p)}`, { cachePolicy: "persist" }),
  getById: (id) => req(`/orders/${id}`, { cachePolicy: "persist" }),
  cancel: (id, reason) =>
    req(`/orders/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),
};

export const prescriptions = {
  create: (d) =>
    req("/prescriptions", { method: "POST", body: JSON.stringify(d) }),
  getById: (id) => req(`/prescriptions/${id}`, { cachePolicy: "persist" }),
  getPublicById: (id) =>
    req(`/prescriptions/public/${id}`, { cacheTtlMs: 60_000, skipAuth: true }),
  verify: (id, token) => {
    const query = token ? `?token=${encodeURIComponent(token)}` : "";
    return req(`/prescriptions/public/verify/${id}${query}`, {
      cacheTtlMs: 30_000,
      skipAuth: true,
    });
  },
  updateStatus: (id, status) =>
    req(`/prescriptions/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  cancel: (id) => req(`/prescriptions/${id}`, { method: "DELETE" }),
  getDoctorList: (p = {}) =>
    req(`/prescriptions?${new URLSearchParams(p)}`, {
      cachePolicy: "persist",
    }),
};

export const consultations = {
  start: (doctorId, reason) =>
    req("/consultations", {
      method: "POST",
      body: JSON.stringify({ doctorId, reason }),
    }),
  getById: (id) => req(`/consultations/${id}`, { cachePolicy: "persist" }),
  accept: (id) => req(`/consultations/${id}/accept`, { method: "PUT" }),
  end: (id, notes) =>
    req(`/consultations/${id}/end`, {
      method: "PUT",
      body: JSON.stringify({ notes }),
    }),
  leave: (id) => req(`/consultations/${id}/leave`, { method: "PUT" }),
  cancel: (id) => req(`/consultations/${id}/cancel`, { method: "PUT" }),
  getMessages: (id) => req(`/consultations/${id}/messages?limit=100`),
  sendMessage: (id, text) =>
    req(`/consultations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};

export const medibot = {
  chat: ({ message, history = [] }) =>
    req("/ai/medibot", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),
};

export const appointments = {
  create: (payload) =>
    req("/appointments", { method: "POST", body: JSON.stringify(payload) }),
  getAll: (p = {}) =>
    req(`/appointments?${new URLSearchParams(p)}`, { cachePolicy: "persist" }),
  confirm: (id) => req(`/appointments/${id}/confirm`, { method: "PUT" }),
  cancel: (id) => req(`/appointments/${id}/cancel`, { method: "PUT" }),
  updateStatus: (id, payload) =>
    req(`/appointments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

export const notifications = {
  getAll: (p = {}) => req(`/notifications?${new URLSearchParams(p)}`),
  markRead: (id) => req(`/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () => req("/notifications/read-all", { method: "PUT" }),
  remove: (id) => req(`/notifications/${id}`, { method: "DELETE" }),
  clear: () => req("/notifications", { method: "DELETE" }),
};

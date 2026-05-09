import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const fallbackHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  `http://${fallbackHost}:5001/api`;

const TOKEN_KEY = "medilink_token";
const REFRESH_KEY = "medilink_refresh";
const USER_KEY = "medilink_user";

const readJson = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const request = async (path, options = {}) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token && !options.skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const payload = await readJson(response);

  if (!response.ok) {
    const message = payload?.message || payload?.error || "Request failed";
    throw new Error(message);
  }

  return payload;
};

export const authStore = {
  saveSession: async ({ token, refreshToken, user }) => {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [REFRESH_KEY, refreshToken || ""],
      [USER_KEY, JSON.stringify(user)],
    ]);
  },
  getSession: async () => {
    const pairs = await AsyncStorage.multiGet([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
    const values = Object.fromEntries(pairs);
    const token = values[TOKEN_KEY];
    const userJson = values[USER_KEY];

    if (!token || !userJson) return null;

    try {
      return {
        token,
        refreshToken: values[REFRESH_KEY],
        user: JSON.parse(userJson),
      };
    } catch {
      await authStore.clearSession();
      return null;
    }
  },
  clearSession: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
  },
};

export const api = {
  health: () => request("/health", { skipAuth: true }),
  login: async (email, password) => {
    const payload = await request("/auth/login", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
    await authStore.saveSession(payload.data);
    return payload.data;
  },
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
  patientDashboard: () => request("/patients/dashboard"),
  doctorDashboard: () => request("/doctors/dashboard"),
  doctors: () => request("/doctors"),
  patientConsultations: () => request("/patients/consultations"),
  doctorConsultations: () => request("/doctors/consultations"),
  prescriptions: () => request("/patients/prescriptions"),
  appointments: () => request("/appointments"),
};

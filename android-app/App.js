import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { api, authStore } from "./src/services/api";
import { colors, spacing } from "./src/theme";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DoctorsScreen from "./src/screens/DoctorsScreen";

const tabs = [
  { key: "home", label: "Home", icon: "home-outline" },
  { key: "doctors", label: "Doctors", icon: "medkit-outline" },
];

export default function App() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    let mounted = true;

    authStore.getSession().then((savedSession) => {
      if (mounted) {
        setSession(savedSession);
        setBooting(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const user = session?.user;
  const authContext = useMemo(
    () => ({
      session,
      setSession,
      logout: async () => {
        try {
          await api.logout();
        } finally {
          await authStore.clearSession();
          setSession(null);
          setActiveTab("home");
        }
      },
    }),
    [session],
  );

  if (booting) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Opening MediLink</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <>
        <ExpoStatusBar style="dark" />
        <LoginScreen onLogin={setSession} />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>MediLink</Text>
          <Text style={styles.title}>
            {user?.role === "doctor"
              ? "Doctor workspace"
              : user?.role === "admin"
                ? "Admin console"
                : "Patient care"}
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.logout}
          onPress={authContext.logout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "home" ? (
          <HomeScreen auth={authContext} onOpenDoctors={() => setActiveTab("doctors")} />
        ) : (
          <DoctorsScreen auth={authContext} />
        )}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              accessibilityRole="button"
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? colors.primary : colors.muted}
              />
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 15,
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  kicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  logout: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  tab: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    gap: 3,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.primarySoft,
  },
  tabText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  tabTextActive: {
    color: colors.primary,
  },
});

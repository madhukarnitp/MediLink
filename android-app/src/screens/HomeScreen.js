import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { api } from "../services/api";
import { colors, spacing } from "../theme";

const numberText = (value) => {
  if (value === undefined || value === null) return "0";
  return String(value);
};

export default function HomeScreen({ auth, onOpenDoctors }) {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = auth.session?.user;

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response =
        user?.role === "doctor"
          ? await api.doctorDashboard()
          : user?.role === "admin"
            ? await api.health()
            : await api.patientDashboard();
      setDashboard(response.data || response);
    } catch (err) {
      setError(err.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = dashboard?.stats || {};
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <Card style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.eyebrow}>Hello, {firstName}</Text>
            <Text style={styles.heroTitle}>Your care is ready.</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role || "patient"}</Text>
          </View>
        </View>
        <Text style={styles.heroCopy}>
          Review consultations, prescriptions, appointments, and doctor availability from
          your phone.
        </Text>
      </Card>

      {loading && !dashboard ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.muted}>Loading dashboard</Text>
        </View>
      ) : null}

      {error ? (
        <Card style={styles.errorCard}>
          <Text style={styles.errorTitle}>Connection issue</Text>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton onPress={load}>Try Again</PrimaryButton>
        </Card>
      ) : null}

      <View style={styles.statsGrid}>
        <Stat label="Consultations" value={numberText(stats.totalConsultations)} icon="chatbubbles-outline" />
        <Stat label="Prescriptions" value={numberText(stats.totalPrescriptions || stats.activePrescriptions)} icon="document-text-outline" />
        <Stat label="Appointments" value={numberText(stats.totalAppointments || stats.upcomingAppointments)} icon="calendar-outline" />
      </View>

      <Text style={styles.sectionTitle}>Quick actions</Text>
      <View style={styles.actions}>
        <Action icon="medkit-outline" label="Find Doctors" onPress={onOpenDoctors} />
        <Action icon="calendar-outline" label="Appointments" onPress={load} />
        <Action icon="document-text-outline" label="Prescriptions" onPress={load} />
        <Action icon="alert-circle-outline" label="SOS" tone="danger" onPress={load} />
      </View>
    </ScrollView>
  );
}

function Stat({ icon, label, value }) {
  return (
    <Card style={styles.stat}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function Action({ icon, label, onPress, tone }) {
  const danger = tone === "danger";
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.action, danger && styles.actionDanger]}
    >
      <Ionicons name={icon} size={23} color={danger ? colors.danger : colors.primary} />
      <Text style={[styles.actionText, danger && styles.actionTextDanger]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  hero: {
    backgroundColor: colors.surfaceMuted,
  },
  heroTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: spacing.xs,
  },
  heroCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  roleBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  roleText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  loading: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg,
  },
  muted: {
    color: colors.muted,
  },
  errorCard: {
    gap: spacing.md,
  },
  errorTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  errorText: {
    color: colors.danger,
    lineHeight: 21,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    minHeight: 120,
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: spacing.md,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  action: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    minHeight: 92,
    padding: spacing.md,
    width: "47.8%",
  },
  actionDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  actionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  actionTextDanger: {
    color: colors.danger,
  },
});

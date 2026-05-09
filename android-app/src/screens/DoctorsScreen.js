import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { api } from "../services/api";
import { colors, spacing } from "../theme";

const getDoctorId = (doctor) => doctor?._id || doctor?.id || doctor?.userId?._id;

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.doctors();
      const data = response.data;
      setDoctors(Array.isArray(data) ? data : data?.doctors || []);
    } catch (err) {
      setError(err.message || "Could not load doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && doctors.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.muted}>Loading doctors</Text>
      </View>
    );
  }

  if (error && doctors.length === 0) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Text style={styles.errorTitle}>Could not load doctors</Text>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton onPress={load}>Try Again</PrimaryButton>
        </Card>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={doctors}
      keyExtractor={(item, index) => String(getDoctorId(item) || index)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Doctors</Text>
          <Text style={styles.subtitle}>Browse available specialists from the API.</Text>
        </View>
      }
      ListEmptyComponent={
        <Card>
          <Text style={styles.muted}>No doctors found. Seed the backend demo data first.</Text>
        </Card>
      }
      renderItem={({ item }) => <DoctorCard doctor={item} />}
    />
  );
}

function DoctorCard({ doctor }) {
  const user = doctor.userId || doctor.user || {};
  const name = user.name || doctor.name || "Doctor";
  const online = Boolean(doctor.online);

  return (
    <Card style={styles.doctorCard}>
      <View style={styles.doctorTop}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.doctorMain}>
          <Text style={styles.doctorName}>{name}</Text>
          <Text style={styles.specialty}>
            {doctor.specialization || doctor.qualification || "General medicine"}
          </Text>
        </View>
        <View style={[styles.status, online && styles.statusOnline]}>
          <Text style={[styles.statusText, online && styles.statusTextOnline]}>
            {online ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Meta icon="school-outline" text={doctor.qualification || "Qualified doctor"} />
        <Meta icon="cash-outline" text={`Rs ${doctor.price || 0}`} />
      </View>
    </Card>
  );
}

function Meta({ icon, text }) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={16} color={colors.muted} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  center: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  muted: {
    color: colors.muted,
    textAlign: "center",
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
  },
  doctorCard: {
    gap: spacing.md,
  },
  doctorTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  doctorMain: {
    flex: 1,
  },
  doctorName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  specialty: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  status: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusOnline: {
    backgroundColor: colors.primarySoft,
  },
  statusText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
  },
  statusTextOnline: {
    color: colors.primaryDark,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  meta: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
});

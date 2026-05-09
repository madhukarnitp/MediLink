import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, spacing } from "../theme";

export default function PrimaryButton({
  children,
  disabled,
  loading,
  onPress,
  tone = "primary",
}) {
  const danger = tone === "danger";
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        danger && styles.danger,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.65,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});

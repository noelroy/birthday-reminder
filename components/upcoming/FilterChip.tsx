import { ThemedText } from "@/components/ThemedText";
import { useAppColors } from "@/hooks/useAppColors";
import { Pressable, StyleSheet } from "react-native";

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  const colors = useAppColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, {borderColor: colors.border}, active && {backgroundColor: colors.tint}, pressed && styles.chipPressed]}
    >
      <ThemedText style={[styles.chipText, active && {color: colors.background}]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minWidth: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chipPressed: { opacity: 0.85 },
  chipText: { fontSize: 12, fontWeight: "600" },
});

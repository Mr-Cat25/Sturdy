import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from './theme';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selectedChip : null,
        pressed ? styles.pressedChip : null,
      ]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  selectedChip: {
    borderColor: colors.primary,
    backgroundColor: colors.chipBackground,
  },
  pressedChip: {
    opacity: 0.85,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedLabel: {
    color: colors.primary,
  },
});
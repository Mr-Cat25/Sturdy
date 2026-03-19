import { ComponentProps } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing } from './theme';

type InputProps = ComponentProps<typeof TextInput> & {
  label: string;
  hint?: string;
};

export function Input({ label, hint, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, props.multiline ? styles.multiline : null, style]}
        {...props}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  input: {
    minHeight: 58,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    lineHeight: 22,
  },
  multiline: {
    minHeight: 140,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
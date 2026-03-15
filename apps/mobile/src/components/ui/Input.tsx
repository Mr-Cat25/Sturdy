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
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    minHeight: 56,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 17,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    lineHeight: 24,
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
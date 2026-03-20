import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { colors, radius, shadow, spacing } from './theme';

type CardProps = PropsWithChildren<ViewProps>;

const { soft: _soft, ...cardShadow } = shadow;

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View {...props} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...cardShadow,
  },
});

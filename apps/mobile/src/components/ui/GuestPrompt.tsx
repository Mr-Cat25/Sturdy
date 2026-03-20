import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { Card } from './Card';
import { colors, radius, spacing } from './theme';

type GuestPromptProps = {
  title: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
};

export function GuestPrompt({
  title,
  body,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
}: GuestPromptProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>

      <View style={styles.actions}>
        <Button label={primaryLabel} onPress={onPrimaryPress} />

        <Pressable accessibilityRole="button" onPress={onSecondaryPress} style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>{secondaryLabel}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  secondaryAction: {
    alignSelf: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  secondaryActionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});
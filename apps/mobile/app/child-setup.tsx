import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
import { useChildProfile } from '../src/context/ChildProfileContext';

const AGE_OPTIONS = Array.from({ length: 16 }, (_, index) => index + 2);

export default function ChildSetupScreen() {
  const { setDraft } = useChildProfile();
  const [childName, setChildName] = useState('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const trimmedChildName = childName.trim();
  const canContinue = trimmedChildName.length > 0 && selectedAge !== null && !isSaving;

  const handleContinue = async () => {
    if (!canContinue) {
      return;
    }

    setIsSaving(true);

    try {
      const guestChild = {
        name: trimmedChildName,
        childAge: selectedAge,
      };

      setDraft({
        name: trimmedChildName,
        childAge: selectedAge,
      });

      await AsyncStorage.setItem('sturdy_guest_child', JSON.stringify(guestChild));
      await AsyncStorage.setItem('sturdy_welcome_done', 'true');
    } catch {
      // Keep the first-time flow resilient even if local storage is unavailable.
    } finally {
      setIsSaving(false);
    }

    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>One quick detail before you start</Text>
        <Text style={styles.title}>Tell us about your child</Text>
        <Text style={styles.supportLine}>
          This helps Sturdy tailor support to your child and their age.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Child name</Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={setChildName}
            placeholder="Your child's name"
            placeholderTextColor={colors.textSecondary}
            style={styles.textInput}
            value={childName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Exact age</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.agePicker}
            showsHorizontalScrollIndicator={false}
          >
            {AGE_OPTIONS.map((age) => {
              const isSelected = selectedAge === age;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={age}
                  onPress={() => setSelectedAge(age)}
                  style={({ pressed }) => [
                    styles.agePill,
                    isSelected ? styles.agePillSelected : null,
                    pressed ? styles.agePillPressed : null,
                  ]}
                >
                  <Text style={[styles.agePillText, isSelected ? styles.agePillTextSelected : null]}>
                    {age}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <View style={styles.ctaBlock}>
        <Button
          label={isSaving ? 'Saving...' : 'Continue'}
          onPress={handleContinue}
          disabled={!canContinue}
        />
        <Text style={styles.reassuranceNote}>You can update this later in Profile.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  supportLine: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 420,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadow,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  textInput: {
    minHeight: 54,
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
  agePicker: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  agePill: {
    minWidth: 56,
    minHeight: 56,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  agePillSelected: {
    backgroundColor: colors.chipBackground,
    borderColor: colors.primary,
  },
  agePillPressed: {
    opacity: 0.82,
  },
  agePillText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  agePillTextSelected: {
    color: colors.primary,
  },
  ctaBlock: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  reassuranceNote: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

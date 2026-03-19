import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';

const AGE_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 2);

export default function NewChildScreen() {
  const { session } = useAuth();
  const [childName, setChildName] = useState('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const canSave = selectedAge !== null;

  const handleSave = async () => {
    if (!canSave || isSaving || !session) return;

    setErrorMessage('');
    setIsSaving(true);

    try {
      const { error } = await supabase.from('child_profiles').insert({
        user_id: session.user.id,
        name: childName.trim() || null,
        child_age: selectedAge,
      });

      if (error) throw error;
      router.back();
    } catch {
      setErrorMessage('Could not save child profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label={isSaving ? 'Saving…' : 'Add Child'}
          onPress={handleSave}
          disabled={!canSave || isSaving}
        />
      }
    >
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Add a child</Text>
        <Text style={styles.subtitle}>
          A little context helps Sturdy tailor scripts to the right moment.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Name (optional)</Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={setChildName}
            placeholder="e.g. Alex"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={childName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Age</Text>
          <Text style={styles.fieldHint}>Required. Pick an age from 2 to 17.</Text>
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
          <Text style={styles.ageHelperText}>
            {selectedAge !== null ? `Age ${selectedAge} selected.` : 'Choose an age to continue.'}
          </Text>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  header: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
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
  fieldHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    minHeight: 52,
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
    minWidth: 52,
    minHeight: 52,
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
  ageHelperText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  errorText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
  },
});


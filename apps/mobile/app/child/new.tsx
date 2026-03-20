import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { GuestPrompt } from '../../src/components/ui/GuestPrompt';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { createChildProfile } from '../../src/lib/childProfiles';

const ageOptions = Array.from({ length: 16 }, (_, index) => index + 2);

export default function NewChildScreen() {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    if (!session) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      await createChildProfile({ name, childAge: age });
      router.replace('/children');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't save this child right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) {
    return (
      <Screen>
        <GuestPrompt
          title="Create an account to add children"
          body="Child profiles are saved to your account after you sign in or create one."
          primaryLabel="Sign In"
          secondaryLabel="Create Account"
          onPrimaryPress={() => router.push('/auth/sign-in')}
          onSecondaryPress={() => router.push('/auth/sign-up')}
        />
      </Screen>
    );
  }

  return (
    <Screen
      footer={<Button label={isSaving ? 'Saving...' : 'Save Child'} onPress={handleSave} disabled={isSaving} />}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Add a child profile</Text>
          <Text style={styles.subtitle}>Name is optional. Age is required.</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Name (optional)</Text>
            <TextInput
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={(value) => {
                setName(value);
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
              placeholder="What do you call them?"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={name}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Age</Text>
            <ScrollView horizontal contentContainerStyle={styles.ageRow} showsHorizontalScrollIndicator={false}>
              {ageOptions.map((option) => {
                const isSelected = age === option;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={option}
                    onPress={() => setAge(option)}
                    style={({ pressed }) => [
                      styles.agePill,
                      isSelected ? styles.agePillSelected : null,
                      pressed ? styles.agePillPressed : null,
                    ]}
                  >
                    <Text style={[styles.agePillText, isSelected ? styles.agePillTextSelected : null]}>{option}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    gap: spacing.md,
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  input: {
    minHeight: 58,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ageRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  agePill: {
    minWidth: 56,
    minHeight: 56,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  agePillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.chipBackground,
  },
  agePillPressed: {
    opacity: 0.82,
  },
  agePillText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  agePillTextSelected: {
    color: colors.primary,
  },
  errorText: {
    color: '#F2B07A',
    fontSize: 13,
    lineHeight: 18,
  },
});

import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';

const AGE_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 2);

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [childName, setChildName] = useState('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!session || !id) return;

    async function loadChild() {
      try {
        const { data, error } = await supabase
          .from('child_profiles')
          .select('name, child_age')
          .eq('id', id)
          .single();

        if (error) throw error;
        setChildName(data.name ?? '');
        setSelectedAge(data.child_age);
      } catch {
        setErrorMessage('Could not load child profile.');
      } finally {
        setIsLoading(false);
      }
    }

    loadChild();
  }, [id, session]);

  const handleSave = async () => {
    if (!selectedAge || isSaving || !session) return;

    setErrorMessage('');
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({ name: childName.trim() || null, child_age: selectedAge })
        .eq('id', id);

      if (error) throw error;
      router.back();
    } catch {
      setErrorMessage('Could not update child profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete child',
      'Remove this child profile? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const { error } = await supabase
                .from('child_profiles')
                .delete()
                .eq('id', id);

              if (error) throw error;
              router.back();
            } catch {
              setErrorMessage('Could not delete child profile. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Screen
      footer={
        <Button
          label={isSaving ? 'Saving…' : 'Save Changes'}
          onPress={handleSave}
          disabled={!selectedAge || isSaving}
        />
      }
    >
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Edit child</Text>
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

      <Pressable
        accessibilityRole="button"
        onPress={handleDelete}
        disabled={isDeleting}
        style={({ pressed }) => [styles.deleteButton, pressed ? styles.deleteButtonPressed : null]}
      >
        <Text style={styles.deleteButtonText}>
          {isDeleting ? 'Deleting…' : 'Delete this child'}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  deleteButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textDecorationLine: 'underline',
  },
});


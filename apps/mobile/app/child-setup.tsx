import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useRouter } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
import { useChildProfile } from '../src/context/ChildProfileContext';

const ageOptions = Array.from({ length: 16 }, (_, index) => index + 2);

export default function ChildSetupScreen() {
  const navigation = useRouter();
  const { width } = useWindowDimensions();
  const { draft, setDraft } = useChildProfile();
  const [childName, setChildName] = useState(draft.name ?? '');
  const [selectedAge, setSelectedAge] = useState<number | null>(draft.childAge);
  const isWide = width >= 700;

  const isChildNameValid = childName.trim().length > 0;
  const isAgeValid = selectedAge !== null;
  const canContinue = isChildNameValid && isAgeValid;
  const footerHint = !isChildNameValid && !isAgeValid
    ? 'Add a name and an age to continue.'
    : !isChildNameValid
      ? 'Add a child name to continue.'
      : !isAgeValid
        ? 'Choose an age from 2 to 17.'
        : 'You can update this later.';

  const handleContinue = () => {
    if (!canContinue || selectedAge === null) {
      return;
    }

    setDraft({
      name: childName.trim(),
      childAge: selectedAge,
    });

    navigation.navigate('/now');
  };

  return (
    <Screen
      footer={
        <View style={styles.footerBlock}>
          <Button label="Continue" onPress={handleContinue} disabled={!canContinue} />
          {!canContinue ? <Text style={styles.footerHint}>{footerHint}</Text> : null}
        </View>
      }
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={[styles.header, isWide ? styles.headerWide : null]}>
        <Text style={styles.title}>Tell us about your child</Text>
        <Text style={styles.subtitle}>
          Add a name and age so Sturdy can keep the script personal, calm, and specific.
        </Text>
      </View>

      <View style={[styles.card, isWide ? styles.cardWide : null]}>
        <View style={[styles.formRow, isWide ? styles.formRowWide : null]}>
          <View style={[styles.inputColumn, isWide ? styles.inputColumnWide : null]}>
            <Input
              autoCapitalize="words"
              autoCorrect={false}
              label="Child name"
              onChangeText={setChildName}
              placeholder="Use the name you call them"
              returnKeyType="next"
              value={childName}
              hint="Required. Use the name you call them."
            />
          </View>

          <View style={styles.ageSection}>
            <Text style={styles.sectionTitle}>Age</Text>
            <Text style={styles.sectionHint}>Required. Choose an age from 2 to 17.</Text>

            <ScrollView
              horizontal
              contentContainerStyle={styles.agePickerRow}
              showsHorizontalScrollIndicator={false}
            >
              {ageOptions.map((option) => {
                const isSelected = selectedAge === option;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={option}
                    onPress={() => setSelectedAge(option)}
                    style={({ pressed }) => [
                      styles.agePill,
                      isSelected ? styles.agePillSelected : null,
                      pressed ? styles.agePillPressed : null,
                    ]}
                  >
                    <Text style={[styles.agePillText, isSelected ? styles.agePillTextSelected : null]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.ageSelectionText}>
              {selectedAge ? `Age ${selectedAge} selected.` : 'Pick an age to continue.'}
            </Text>
          </View>
        </View>
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
  headerWide: {
    maxWidth: 820,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    flexShrink: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: spacing.lg,
    gap: spacing.xl,
    ...shadow,
  },
  cardWide: {
    alignSelf: 'center',
    maxWidth: 980,
    width: '100%',
  },
  footerBlock: {
    gap: spacing.sm,
  },
  formRow: {
    gap: spacing.lg,
  },
  formRowWide: {
    flexDirection: 'column',
  },
  inputColumn: {
    minWidth: 0,
  },
  inputColumnWide: {
    width: '100%',
  },
  ageSection: {
    gap: spacing.md,
  },
  agePickerRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    flexShrink: 1,
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
    paddingHorizontal: spacing.md,
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
  ageSelectionText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footerHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
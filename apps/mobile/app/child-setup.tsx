import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router, useRouter } from 'expo-router';

import { Button } from '../src/components/ui/Button';
import { Chip } from '../src/components/ui/Chip';
import { Input } from '../src/components/ui/Input';
import { Screen } from '../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../src/components/ui/theme';
import { useChildProfile } from '../src/context/ChildProfileContext';

const neurotypeOptions = ['None', 'ADHD', 'Autism', 'Anxiety', 'Sensory'];

export default function ChildSetupScreen() {
  const navigation = useRouter();
  const { width } = useWindowDimensions();
  const { draft, setDraft } = useChildProfile();
  const [childName, setChildName] = useState(draft.name ?? '');
  const [age, setAge] = useState(draft.childAge === null ? '' : String(draft.childAge));
  const [selectedNeurotypes, setSelectedNeurotypes] = useState<string[]>(draft.neurotype);
  const isWide = width >= 700;

  const ageNumber = Number(age);
  const isAgeValid = Number.isInteger(ageNumber) && ageNumber >= 2 && ageNumber <= 17;

  const ageHint = useMemo(() => {
    if (!age.length) {
      return 'Required. Enter an exact age from 2 to 17.';
    }

    if (!isAgeValid) {
      return 'Please enter a whole number between 2 and 17.';
    }

    return 'Great. We use exact age to keep the script developmentally on target.';
  }, [age.length, isAgeValid]);

  const isNoneSelected = selectedNeurotypes.length === 0;

  const toggleNeurotype = (value: string) => {
    if (value === 'None') {
      setSelectedNeurotypes([]);
      return;
    }

    setSelectedNeurotypes((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const handleContinue = () => {
    if (!isAgeValid) {
      return;
    }

    setDraft({
      name: childName.trim() || undefined,
      childAge: ageNumber,
      neurotype: selectedNeurotypes,
    });

    navigation.navigate('/now');
  };

  return (
    <Screen footer={<Button label="Continue" onPress={handleContinue} disabled={!isAgeValid} />}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={[styles.header, isWide ? styles.headerWide : null]}>
        <Text style={styles.title}>Tell us about your child</Text>
        <Text style={styles.subtitle}>
          A little context helps Sturdy make the script feel calmer, clearer, and more age-aware.
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
              placeholder="Optional"
              returnKeyType="next"
              value={childName}
            />
          </View>

          <View style={[styles.inputColumn, isWide ? styles.ageColumnWide : null]}>
            <Input
              keyboardType="number-pad"
              label="Exact age"
              maxLength={2}
              onChangeText={(value) => setAge(value.replace(/[^0-9]/g, ''))}
              placeholder="Required"
              value={age}
              hint={ageHint}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Neurotype</Text>
          <Text style={styles.sectionHint}>
            Optional. None is selected by default. Choose any that help us understand the
            moment.
          </Text>
          <View style={styles.chipRow}>
            {neurotypeOptions.map((option) => (
              <Chip
                key={option}
                label={option}
                onPress={() => toggleNeurotype(option)}
                selected={option === 'None' ? isNoneSelected : selectedNeurotypes.includes(option)}
              />
            ))}
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
  formRow: {
    gap: spacing.lg,
  },
  formRowWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputColumn: {
    minWidth: 0,
  },
  inputColumnWide: {
    flex: 1,
  },
  ageColumnWide: {
    flex: 0.45,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    flexShrink: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
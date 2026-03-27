// apps/mobile/app/child-setup.tsx
// Fix: uses child_age column (not age_band)
// Fix: compact layout — less wasted space
// Fix: errors surfaced to user

import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage        from '@react-native-async-storage/async-storage';
import { router }          from 'expo-router';
import { Button }          from '../src/components/ui/Button';
import { Screen }          from '../src/components/ui/Screen';
import { useAuth }         from '../src/context/AuthContext';
import { useChildProfile } from '../src/context/ChildProfileContext';
import { supabase }        from '../src/lib/supabase';
import { colors, radius, shadow, spacing, type } from '../src/theme';

const AGES   = Array.from({ length: 16 }, (_, i) => i + 2); // 2–17
const ITEM_H = 48;

export default function ChildSetupScreen() {
  const { session }              = useAuth();
  const { setActiveChild }       = useChildProfile();
  const [name,        setName]   = useState('');
  const [selectedAge, setAge]    = useState<number | null>(null);
  const [error,       setError]  = useState('');
  const [saving,      setSaving] = useState(false);
  const drumRef                  = useRef<ScrollView>(null);

  const canContinue = name.trim().length > 0 && selectedAge !== null;

  const onDrumScroll = (y: number) => {
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_H), AGES.length - 1));
    setAge(AGES[idx]);
  };

  const handleContinue = async () => {
    if (!canContinue || saving) return;
    const trimmed = name.trim();
    setSaving(true);
    setError('');
    try {
      if (session) {
        const { error: dbErr } = await supabase
          .from('child_profiles')
          .insert({
            user_id:   session.user.id,
            name:      trimmed,
            child_age: selectedAge,  // ← correct column name
            age_band:  selectedAge! <= 4 ? '2-4' : selectedAge! <= 7 ? '5-7' : '8-12',
          });
        if (dbErr) throw dbErr;
      } else {
        await AsyncStorage.setItem(
          'sturdy_guest_child',
          JSON.stringify({ name: trimmed, childAge: selectedAge }),
        );
      }
      setActiveChild({
        name: trimmed, childAge: selectedAge!,
        neurotype: null
      });
      router.replace('/(tabs)');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save child profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Tell us about{'\n'}your child</Text>
        <Text style={styles.sub}>Sturdy adapts every script to their exact age.</Text>
      </View>

      <View style={[styles.card, shadow.md]}>

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Child name</Text>
          <TextInput
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            placeholder="Olivia"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={v => { setName(v); if (error) setError(''); }}
            style={styles.nameInput}
          />
        </View>

        {/* Age drum */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Exact age</Text>
          <View style={styles.drumWrap}>
            <View pointerEvents="none" style={styles.rail} />
            <ScrollView
              ref={drumRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_H}
              decelerationRate="fast"
              contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
              onMomentumScrollEnd={e => onDrumScroll(e.nativeEvent.contentOffset.y)}
              onScrollEndDrag={e => onDrumScroll(e.nativeEvent.contentOffset.y)}
            >
              {AGES.map(age => (
                <Pressable
                  key={age}
                  style={styles.ageItem}
                  onPress={() => {
                    setAge(age);
                    drumRef.current?.scrollTo({
                      y: AGES.indexOf(age) * ITEM_H,
                      animated: true,
                    });
                  }}
                >
                  <Text style={[
                    styles.ageText,
                    selectedAge === age ? styles.ageSelected : null,
                    selectedAge !== null && Math.abs(age - selectedAge) === 1
                      ? styles.ageNear : null,
                  ]}>
                    {age}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          {selectedAge !== null
            ? <Text style={styles.ageConfirm}>Age {selectedAge} selected</Text>
            : <Text style={styles.ageHint}>Scroll to select age</Text>}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <Button
        label={saving ? 'Saving…' : 'Continue'}
        onPress={handleContinue}
        disabled={!canContinue || saving}
        loading={saving}
      />

      <Text style={styles.reassure}>You can update this anytime in Profile.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header:  { gap: spacing.xs, marginTop: spacing.xs },
  title:   { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36, letterSpacing: -0.4 },
  sub:     { ...type.body, color: colors.textSecondary },

  card:    { backgroundColor: colors.surface, borderRadius: radius.large, padding: spacing.lg, gap: spacing.lg },
  field:   { gap: spacing.xs },
  fieldLabel: { ...type.label, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },

  nameInput: {
    fontSize:          24,
    fontWeight:        '400',
    color:             colors.text,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingVertical:   spacing.xs,
  },

  drumWrap: { height: ITEM_H * 5, position: 'relative', overflow: 'hidden' },
  rail: {
    position:          'absolute',
    top:               '50%',
    left:              0,
    right:             0,
    height:            ITEM_H,
    marginTop:         -(ITEM_H / 2),
    borderTopWidth:    1.5,
    borderBottomWidth: 1.5,
    borderColor:       colors.border,
    zIndex:            1,
  },
  ageItem:    { height: ITEM_H, alignItems: 'center', justifyContent: 'center' },
  ageText:    { fontSize: 20, color: colors.textMuted, opacity: 0.35 },
  ageNear:    { opacity: 0.6 },
  ageSelected:{ fontSize: 26, fontWeight: '700', color: colors.text, opacity: 1 },
  ageConfirm: { ...type.caption, color: colors.sage,     fontWeight: '600' },
  ageHint:    { ...type.caption, color: colors.textMuted },

  error:    { ...type.bodySmall, color: colors.dangerDark },
  reassure: { ...type.caption,   color: colors.textMuted, textAlign: 'center' },
});


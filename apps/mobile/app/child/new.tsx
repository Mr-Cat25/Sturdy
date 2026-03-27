// apps/mobile/app/child/new.tsx
// Fix: uses child_age column (not age_band)
// Fix: compact layout

import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router }          from 'expo-router';
import { Button }          from '../../src/components/ui/Button';
import { Screen }          from '../../src/components/ui/Screen';
import { useAuth }         from '../../src/context/AuthContext';
import { useChildProfile } from '../../src/context/ChildProfileContext';
import { supabase }        from '../../src/lib/supabase';
import { colors, radius, shadow, spacing, type } from '../../src/theme';

const AGES   = Array.from({ length: 16 }, (_, i) => i + 2);
const ITEM_H = 48;

export default function NewChildScreen() {
  const { session }      = useAuth();
  const { reloadChild }  = useChildProfile();
  const [name,   setName]   = useState('');
  const [age,    setAge]    = useState<number | null>(null);
  const [error,  setError]  = useState('');
  const [saving, setSaving] = useState(false);
  const drumRef             = useRef<ScrollView>(null);

  const canSave = name.trim().length > 0 && age !== null;

  const onDrumScroll = (y: number) => {
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_H), AGES.length - 1));
    setAge(AGES[idx]);
  };

  const handleSave = async () => {
    if (!canSave || saving || !session) return;
    setSaving(true);
    setError('');
    try {
      const { error: dbErr } = await supabase
        .from('child_profiles')
        .insert({
          user_id:   session.user.id,
          name:      name.trim(),
          child_age: age,           // ← correct column name
          age_band:  age! <= 4 ? '2-4' : age! <= 7 ? '5-7' : '8-12',
        });
      if (dbErr) throw dbErr;
      await reloadChild();
      router.back();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save child profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label={saving ? 'Saving…' : 'Add child'}
          loading={saving}
          disabled={!canSave || saving}
          onPress={handleSave}
        />
      }
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Add a child</Text>
        <Text style={styles.sub}>Each child gets their own age-matched scripts.</Text>
      </View>

      <View style={[styles.card, shadow.sm]}>

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Child name</Text>
          <TextInput
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            placeholder="Name"
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
              snapToInterval={ITEM_H}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
              onMomentumScrollEnd={e => onDrumScroll(e.nativeEvent.contentOffset.y)}
              onScrollEndDrag={e => onDrumScroll(e.nativeEvent.contentOffset.y)}
            >
              {AGES.map(a => (
                <Pressable
                  key={a}
                  style={styles.ageItem}
                  onPress={() => {
                    setAge(a);
                    drumRef.current?.scrollTo({
                      y: AGES.indexOf(a) * ITEM_H,
                      animated: true,
                    });
                  }}
                >
                  <Text style={[
                    styles.ageText,
                    age === a ? styles.ageSelected : null,
                    age !== null && Math.abs(a - age) === 1 ? styles.ageNear : null,
                  ]}>
                    {a}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          {age !== null
            ? <Text style={styles.ageConfirm}>Age {age} selected</Text>
            : <Text style={styles.ageHint}>Scroll to select age</Text>}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back:     { alignSelf: 'flex-start', paddingVertical: spacing.xs },
  backText: { ...type.body, fontWeight: '600', color: colors.textSecondary },
  header:   { gap: spacing.xs },
  title:    { fontSize: 28, fontWeight: '800', color: colors.text },
  sub:      { ...type.body, color: colors.textSecondary },

  card:  { backgroundColor: colors.surface, borderRadius: radius.large, padding: spacing.lg, gap: spacing.lg },
  field: { gap: spacing.xs },
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
  },
  ageItem:     { height: ITEM_H, alignItems: 'center', justifyContent: 'center' },
  ageText:     { fontSize: 20, color: colors.textMuted, opacity: 0.35 },
  ageNear:     { opacity: 0.6 },
  ageSelected: { fontSize: 26, fontWeight: '700', color: colors.text, opacity: 1 },
  ageConfirm:  { ...type.caption, color: colors.sage, fontWeight: '600' },
  ageHint:     { ...type.caption, color: colors.textMuted },
  error:       { ...type.bodySmall, color: colors.dangerDark },
});

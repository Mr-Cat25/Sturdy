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

const AGES   = Array.from({ length: 16 }, (_, i) => i + 2);
const ITEM_H = 56;

export default function ChildSetupScreen() {
  const { session }              = useAuth();
  const { setActiveChild }       = useChildProfile();
  const [name,    setName]       = useState('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [saving,  setSaving]     = useState(false);
  const drumRef                  = useRef<ScrollView>(null);

  const canContinue = name.trim().length > 0 && selectedAge !== null;

  const onDrumScroll = (y: number) => {
    const index   = Math.round(y / ITEM_H);
    const clamped = Math.max(0, Math.min(index, AGES.length - 1));
    setSelectedAge(AGES[clamped]);
  };

  const handleContinue = async () => {
    if (!canContinue || saving) return;
    const trimmed = name.trim();
    setSaving(true);
    try {
      if (session) {
        await supabase.from('child_profiles').insert({
          user_id:   session.user.id,
          name:      trimmed,
          child_age: selectedAge,
        });
      } else {
        await AsyncStorage.setItem(
          'sturdy_guest_child',
          JSON.stringify({ name: trimmed, childAge: selectedAge }),
        );
      }
      setActiveChild({ name: trimmed, childAge: selectedAge! });
    } catch { /* non-fatal — context still set */ }
    setSaving(false);
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <Text style={styles.orientation}>One quick step before you start</Text>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Tell us about{'\n'}your child</Text>
        <Text style={styles.sub}>
          This helps Sturdy tailor support to your child and their age.
        </Text>
      </View>

      <View style={[styles.card, shadow.md]}>

        {/* Name field */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Child name</Text>
          <TextInput
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            placeholder="Olivia"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
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
              onMomentumScrollEnd={e =>
                onDrumScroll(e.nativeEvent.contentOffset.y)
              }
              onScrollEndDrag={e =>
                onDrumScroll(e.nativeEvent.contentOffset.y)
              }
            >
              {AGES.map(age => (
                <Pressable
                  key={age}
                  style={styles.ageItem}
                  onPress={() => {
                    setSelectedAge(age);
                    drumRef.current?.scrollTo({
                      y:        AGES.indexOf(age) * ITEM_H,
                      animated: true,
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.ageText,
                      selectedAge === age ? styles.ageTextSelected : null,
                      selectedAge !== null &&
                      Math.abs(age - selectedAge) === 1
                        ? styles.ageTextNear
                        : null,
                    ]}
                  >
                    {age}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {selectedAge !== null ? (
            <Text style={styles.ageConfirm}>Age {selectedAge} selected</Text>
          ) : (
            <Text style={styles.ageHint}>Scroll to select your child's age</Text>
          )}
        </View>

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
  orientation: {
    ...type.label,
    color:         colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop:     spacing.xs,
  },

  titleBlock: { gap: spacing.xs },
  title: {
    fontSize:      32,
    fontWeight:    '800',
    lineHeight:    38,
    color:         colors.text,
    letterSpacing: -0.4,
  },
  sub: { ...type.body, color: colors.textSecondary },

  card: {
    backgroundColor: colors.surface,
    borderRadius:    radius.large,
    padding:         spacing.lg,
    gap:             spacing.xl,
  },
  field:      { gap: spacing.sm },
  fieldLabel: {
    ...type.label,
    color:         colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  nameInput: {
    fontSize:           26,
    fontWeight:         '400',
    color:              colors.text,
    borderBottomWidth:  2,
    borderBottomColor:  colors.border,
    paddingVertical:    spacing.xs,
    paddingHorizontal:  0,
  },

  drumWrap: {
    height:   ITEM_H * 5,
    position: 'relative',
    overflow: 'hidden',
  },
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
  ageItem: {
    height:         ITEM_H,
    alignItems:     'center',
    justifyContent: 'center',
  },
  ageText: {
    fontSize:   22,
    fontWeight: '400',
    color:      colors.textMuted,
    opacity:    0.4,
  },
  ageTextNear:     { opacity: 0.65 },
  ageTextSelected: {
    fontSize:   28,
    fontWeight: '700',
    color:      colors.text,
    opacity:    1,
  },

  ageConfirm: { ...type.caption, color: colors.sage,     fontWeight: '600' },
  ageHint:    { ...type.caption, color: colors.textMuted },

  reassure: { ...type.caption, color: colors.textMuted, textAlign: 'center' },
});

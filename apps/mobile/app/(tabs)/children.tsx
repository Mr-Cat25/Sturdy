import { StyleSheet, Text, View } from 'react-native';
import { StatusBar }    from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, type } from '../../src/theme';

export default function ChildrenScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>Children</Text>
        <Text style={styles.sub}>Manage child profiles and switching.</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Child switching coming in Phase 2.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.background },
  content: {
    flex:              1,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    gap:               spacing.lg,
  },
  title:           { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36 },
  sub:             { ...type.body, color: colors.textSecondary },
  placeholder:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { ...type.body, color: colors.textMuted, textAlign: 'center' },
});

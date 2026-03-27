import { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar }    from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

type ScreenProps = PropsWithChildren<{
  footer?:    ReactNode;
  scrollable?: boolean;
  dark?:       boolean;
}>;

export function Screen({ children, footer, scrollable = true, dark = false }: ScreenProps) {
  const bg = dark ? colors.night : colors.background;

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.fixed}>{children}</View>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        {content}
        {footer ? (
          <View style={[
            styles.footer,
            {
              backgroundColor: bg,
              borderTopColor: dark
                ? 'rgba(255,255,255,0.06)'
                : colors.borderSoft,
            },
          ]}>
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  keyboard: { flex: 1 },
  scroll:  { flex: 1 },
  scrollContent: {
    flexGrow:          1,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xxl,
    gap:               spacing.lg,
  },
  fixed: {
    flex:              1,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.sm,
    paddingBottom:     spacing.md,
    borderTopWidth:    1,
  },
});

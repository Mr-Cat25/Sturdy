import { StyleSheet, Text } from 'react-native';
import { Tabs }             from 'expo-router';
import { colors, type }     from '../../src/theme';

function TabIcon({ focused, glyph }: { focused: boolean; glyph: string }) {
  return (
    <Text style={[styles.icon, focused ? styles.iconActive : styles.iconInactive]}>
      {glyph}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:             false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor:  colors.borderSoft,
          borderTopWidth:  1,
          height:          60,
          paddingBottom:   8,
        },
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle:        styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:      'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="⊞" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title:      'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="◎" />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title:      'Account',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="○" />,
        }}
      />
      <Tabs.Screen name="saved"    options={{ href: null }} />
      <Tabs.Screen name="history"  options={{ href: null }} />
      <Tabs.Screen name="children" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon:         { fontSize: 18, lineHeight: 22 },
  iconActive:   { opacity: 1 },
  iconInactive: { opacity: 0.3 },
  label: {
    ...type.label,
    fontSize:      10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop:     -2,
  },
});

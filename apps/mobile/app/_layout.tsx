import { Stack } from 'expo-router';

import { colors } from '../src/components/ui/theme';
import { AuthProvider } from '../src/context/AuthContext';
import { ChildProfileProvider } from '../src/context/ChildProfileContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ChildProfileProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        />
      </ChildProfileProvider>
    </AuthProvider>
  );
}
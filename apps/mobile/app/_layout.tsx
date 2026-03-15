import { Stack } from 'expo-router';

import { colors } from '../src/components/ui/theme';
import { ChildProfileProvider } from '../src/context/ChildProfileContext';

export default function RootLayout() {
  return (
    <ChildProfileProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      />
    </ChildProfileProvider>
  );
}
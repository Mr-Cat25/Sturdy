// app/(tabs)/sos-placeholder.tsx
// This screen is never shown — the tab button opens the SOS modal sheet.
// Required by Expo Router to register the tab slot.

import { View } from 'react-native';
import { colors } from '../../src/theme';

export default function SOSPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}


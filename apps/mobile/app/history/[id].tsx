import { Redirect } from 'expo-router';

export default function LegacyHistoryDetailRedirect() {
  return <Redirect href="/(tabs)/history" />;
}

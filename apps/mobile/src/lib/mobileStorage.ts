import AsyncStorage from '@react-native-async-storage/async-storage';

export const WELCOME_DONE_KEY = 'sturdy_welcome_done';
export const GUEST_CHILD_KEY = 'sturdy_guest_child';

export type GuestChildProfile = {
  name: string;
  childAge: number;
};

export async function getWelcomeDone() {
  return (await AsyncStorage.getItem(WELCOME_DONE_KEY)) === 'true';
}

export async function setWelcomeDone() {
  await AsyncStorage.setItem(WELCOME_DONE_KEY, 'true');
}

export async function getGuestChild() {
  const rawValue = await AsyncStorage.getItem(GUEST_CHILD_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<GuestChildProfile>;

    if (typeof parsed.childAge !== 'number') {
      return null;
    }

    return {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      childAge: parsed.childAge,
    } satisfies GuestChildProfile;
  } catch {
    return null;
  }
}

export async function setGuestChild(profile: GuestChildProfile) {
  await AsyncStorage.setItem(
    GUEST_CHILD_KEY,
    JSON.stringify({
      name: profile.name.trim(),
      childAge: profile.childAge,
    }),
  );
}
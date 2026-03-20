export const sturdyColors = {
  warmCoral: '#FF7A7A',
  softOrange: '#FFB36B',
  skyBlue: '#6FA8FF',
  calmBlue: '#4F8BFF',
  background: '#09111E',
  cardBackground: '#111B2E',
  softSectionBackground: '#15213A',
  textPrimary: '#F6FAFF',
  textSecondary: '#A7B3C6',
  textMuted: '#7F8CA3',
  success: '#8FD3B4',
  borderSoft: '#2A3853',
  borderSubtle: '#1A2538',
  white: '#FFFFFF',
} as const;

export const sturdySpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const sturdyRadii = {
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

export const sturdyShadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.38,
    shadowRadius: 28,
    elevation: 8,
  },
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 5,
  },
} as const;

export const sturdyTypography = {
  h1: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 42,
  },
  h2: {
    fontSize: 21,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800' as const,
    lineHeight: 16,
    letterSpacing: 1.2,
  },
} as const;

export const sturdyComponents = {
  card: {
    backgroundColor: sturdyColors.cardBackground,
    borderColor: sturdyColors.borderSubtle,
    borderWidth: 1,
    borderRadius: sturdyRadii.lg,
  },
  softCard: {
    backgroundColor: sturdyColors.softSectionBackground,
    borderColor: sturdyColors.borderSoft,
    borderWidth: 1,
    borderRadius: sturdyRadii.md,
  },
  primaryButton: {
    backgroundColor: sturdyColors.calmBlue,
    borderRadius: sturdyRadii.md,
    minHeight: 58,
    paddingHorizontal: sturdySpacing.lg,
    paddingVertical: sturdySpacing.sm,
  },
  sectionTitle: {
    color: sturdyColors.textPrimary,
    ...sturdyTypography.h2,
  },
  paragraph: {
    color: sturdyColors.textSecondary,
    ...sturdyTypography.body,
  },
} as const;

export const sturdyTheme = {
  colors: sturdyColors,
  spacing: sturdySpacing,
  radii: sturdyRadii,
  shadows: sturdyShadows,
  typography: sturdyTypography,
  components: sturdyComponents,
} as const;
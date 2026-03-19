export const sturdyColors = {
  warmCoral: '#FF7A7A',
  softOrange: '#FFB36B',
  skyBlue: '#6FA8FF',
  calmBlue: '#557FE6',
  background: '#F6F8FC',
  cardBackground: '#FFFFFF',
  softSectionBackground: '#EEF2FA',
  textPrimary: '#1C2433',
  textSecondary: '#4F596B',
  textMuted: '#8B95A7',
  success: '#7BCFA6',
  borderSoft: '#D7E0ED',
  borderSubtle: '#E7EDF5',
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
    shadowColor: '#24304A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 6,
  },
  soft: {
    shadowColor: '#24304A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
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
export const typography = {
  variants: {
    h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    h2: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
    h3: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
    h4: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    h5: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    body3: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    small: { fontSize: 10, fontWeight: '400' as const, lineHeight: 14 },
    button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
    label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
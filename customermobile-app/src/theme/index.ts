import { colors, getColorScheme, ColorScheme } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export const createTheme = (colorScheme: ColorScheme = 'light') => ({
  colors: getColorScheme(colorScheme),
  typography,
  spacing,
  borderRadius,
  shadows,
});

export type Theme = ReturnType<typeof createTheme>;

export { colors, typography, spacing, borderRadius, shadows };
export default createTheme;

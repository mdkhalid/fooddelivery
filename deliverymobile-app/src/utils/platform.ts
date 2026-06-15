import { Platform, Dimensions } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

const { width, height } = Dimensions.get('window');
export const screenWidth = width;
export const screenHeight = height;
export const isSmallScreen = width < 375;
export const isMediumScreen = width >= 375 && width < 768;
export const isLargeScreen = width >= 768;

export const getStatusBarHeight = (): number => {
  if (isIOS) return 44;
  return 24;
};

export const getBottomTabHeight = (): number => {
  if (isIOS) return 83;
  return 56;
};
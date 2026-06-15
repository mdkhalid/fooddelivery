import React from 'react';
import { View, Text, Image, StyleSheet, ImageStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/spacing';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ImageStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  style,
}) => {
  const sizeStyle = styles[`${size}Avatar`];

  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.base, sizeStyle, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.base, sizeStyle, styles.placeholder]}>
      <Text style={[styles.placeholderText, styles[`${size}Text`]]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const sizes = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  smAvatar: {
    width: sizes.sm,
    height: sizes.sm,
  },
  mdAvatar: {
    width: sizes.md,
    height: sizes.md,
  },
  lgAvatar: {
    width: sizes.lg,
    height: sizes.lg,
  },
  xlAvatar: {
    width: sizes.xl,
    height: sizes.xl,
  },
  placeholder: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 18,
  },
  xlText: {
    fontSize: 24,
  },
});

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/spacing';

interface AvatarProps { uri?: string; name?: string; size?: number; }

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 48 }) => {
  if (uri) return <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />;
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  return <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}><Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text></View>;
};

const styles = StyleSheet.create({
  image: { backgroundColor: colors.gray200 },
  placeholder: { backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.white, fontWeight: typography.weights.bold },
});

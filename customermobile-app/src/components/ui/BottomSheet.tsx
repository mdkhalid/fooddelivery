import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BottomSheetModal, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface BottomSheetProps {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ title, children, onClose }, ref) => {
    const snapPoints = useMemo(() => ['40%', '70%', '90%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handle}
        backgroundStyle={styles.background}
      >
        {title && (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.gray500} />
            </TouchableOpacity>
          </View>
        )}
        <BottomSheetScrollView style={styles.content}>
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  handle: {
    backgroundColor: colors.gray300,
    width: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    ...typography.variants.h4,
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
});

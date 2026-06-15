import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { TextInput } from '../../components/ui/TextInput';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useVehicle } from '../../hooks/useVehicle';

const VEHICLE_TYPES = [
  { label: 'Car', value: 'car' },
  { label: 'Bike', value: 'bike' },
  { label: 'Scooter', value: 'scooter' },
  { label: 'Bicycle', value: 'bicycle' },
];

export const VehicleScreen: React.FC = () => {
  const { vehicles, addVehicle, isLoading } = useVehicle();
  const [type, setType] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const handleSave = () => {
    if (!type || !licensePlate) { Alert.alert('Error', 'Vehicle type and license plate are required'); return; }
    addVehicle({ type: type as any, make, model, year: year ? parseInt(year) : undefined, color, licensePlate });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>My Vehicle</Text>
        {vehicles.length > 0 && vehicles.map(vehicle => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <Ionicons name="car-outline" size={24} color={colors.primary} />
              <Text style={styles.vehicleName}>{vehicle.make || vehicle.type} {vehicle.model || ''}</Text>
            </View>
            <Text style={styles.vehiclePlate}>{vehicle.licensePlate}</Text>
          </View>
        ))}
        <View style={styles.form}>
          <Text style={styles.formTitle}>{vehicles.length > 0 ? 'Add Another Vehicle' : 'Add Your Vehicle'}</Text>
          <Select label="Vehicle Type" options={VEHICLE_TYPES} value={type} onValueChange={setType} />
          <TextInput label="Make" placeholder="e.g., Toyota" value={make} onChangeText={setMake} />
          <TextInput label="Model" placeholder="e.g., Corolla" value={model} onChangeText={setModel} />
          <TextInput label="Year" placeholder="e.g., 2022" value={year} onChangeText={setYear} keyboardType="numeric" />
          <TextInput label="Color" placeholder="e.g., Red" value={color} onChangeText={setColor} />
          <TextInput label="License Plate" placeholder="ABC1234" value={licensePlate} onChangeText={setLicensePlate} icon="card-outline" isRequired />
          <Button title="Save Vehicle" onPress={handleSave} isLoading={isLoading} style={styles.button} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  title: { ...typography.variants.h2, color: colors.text, marginBottom: spacing.xl },
  vehicleCard: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.primary + '40' },
  vehicleHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  vehicleName: { ...typography.variants.h5, color: colors.text },
  vehiclePlate: { ...typography.variants.body2, color: colors.gray500 },
  form: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.xl, marginTop: spacing.lg },
  formTitle: { ...typography.variants.h4, color: colors.text, marginBottom: spacing.lg },
  button: { marginTop: spacing.md },
});

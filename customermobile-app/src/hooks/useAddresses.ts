import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services';
import { useLocationStore } from '../stores/locationStore';
import { Address } from '../types/restaurant.types';

export const useAddresses = () => {
  const queryClient = useQueryClient();
  const { setSelectedAddress } = useLocationStore();

  const { data: addresses, isLoading, error } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => userService.getAddresses(),
    staleTime: 5 * 60 * 1000,
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: Omit<Address, 'id'>) => userService.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, data }: { addressId: string; data: Partial<Address> }) =>
      userService.updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) => userService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (addressId: string) => userService.setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const addAddress = (data: Omit<Address, 'id'>) => {
    addAddressMutation.mutate(data);
  };

  const updateAddress = (addressId: string, data: Partial<Address>) => {
    updateAddressMutation.mutate({ addressId, data });
  };

  const deleteAddress = (addressId: string) => {
    deleteAddressMutation.mutate(addressId);
  };

  const setDefault = (addressId: string) => {
    setDefaultMutation.mutate(addressId);
    const address = addresses?.find((addr) => addr.id === addressId);
    if (address) {
      setSelectedAddress(address);
    }
  };

  return {
    addresses: addresses || [],
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    isAdding: addAddressMutation.isPending,
    isUpdating: updateAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
  };
};

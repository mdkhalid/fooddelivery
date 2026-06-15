import { create } from 'zustand';

interface UIState {
  isBottomSheetVisible: boolean;
  bottomSheetContent: string | null;
  isModalVisible: boolean;
  modalContent: string | null;
  isToastVisible: boolean;
  toastMessage: string;
  toastType: 'success' | 'error' | 'info';
  showBottomSheet: (content: string) => void;
  hideBottomSheet: () => void;
  showModal: (content: string) => void;
  hideModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBottomSheetVisible: false,
  bottomSheetContent: null,
  isModalVisible: false,
  modalContent: null,
  isToastVisible: false,
  toastMessage: '',
  toastType: 'info',

  showBottomSheet: (content) => set({ isBottomSheetVisible: true, bottomSheetContent: content }),
  hideBottomSheet: () => set({ isBottomSheetVisible: false, bottomSheetContent: null }),
  showModal: (content) => set({ isModalVisible: true, modalContent: content }),
  hideModal: () => set({ isModalVisible: false, modalContent: null }),
  showToast: (message, type = 'info') => set({ isToastVisible: true, toastMessage: message, toastType: type }),
  hideToast: () => set({ isToastVisible: false, toastMessage: '' }),
}));

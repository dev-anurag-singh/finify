import { create } from 'zustand';

type OpenTransactionState = {
  id: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenTransaction = create<OpenTransactionState>(set => ({
  id: '',
  isOpen: false,
  onOpen: id => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: '' }),
}));

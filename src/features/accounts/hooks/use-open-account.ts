import { create } from 'zustand';

type OpenAccountState = {
  id: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenAccount = create<OpenAccountState>(set => ({
  id: '',
  isOpen: false,
  onOpen: id => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: '' }),
}));

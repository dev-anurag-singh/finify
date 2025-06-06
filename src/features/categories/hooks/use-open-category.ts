import { create } from 'zustand';

type OpenCategoryState = {
  id: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenCategory = create<OpenCategoryState>(set => ({
  id: '',
  isOpen: false,
  onOpen: id => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: '' }),
}));

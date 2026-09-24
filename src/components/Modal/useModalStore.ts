import { create } from "zustand";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
export type ModalPosition = "center" | "top" | "bottom" | "left" | "right";

export interface ModalInstance {
  id: string;
  show: boolean;
  size: ModalSize;
  position: ModalPosition;
  closeOnBackdrop: boolean;
  closeOnEsc: boolean;
  onShow?: () => void;
  onHide?: () => void;
}

interface ModalStoreState {
  modals: Record<string, ModalInstance>;
  registerModal: (modal: ModalInstance) => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
  updateModal: (id: string, partial: Partial<ModalInstance>) => void;
  unregisterModal: (id: string) => void;
  isOpen: (id: string) => boolean;
}
export type propsInitialsModal = {
  id:number;
  show:boolean;
  onHide: ()=>void;
}
export const useModalStore = create<ModalStoreState>((set, get) => ({
  modals: {},

  registerModal: (modal) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modal.id]: { ...modal, ...(state.modals[modal.id] ?? {}) },
      },
    })),

  openModal: (id) =>
    set((state) => {
      const current = state.modals[id];
      if (!current) return state;
      current.onShow?.();
      return {
        modals: { ...state.modals, [id]: { ...current, show: true } },
      };
    }),

  closeModal: (id) =>
    set((state) => {
      const current = state.modals[id];
      if (!current) return state;
      current.onHide?.();
      return {
        modals: { ...state.modals, [id]: { ...current, show: false } },
      };
    }),

  toggleModal: (id) => {
    const current = get().modals[id];
    if (!current) return;
    current.show ? get().closeModal(id) : get().openModal(id);
  },

  updateModal: (id, partial) =>
    set((state) => {
      const current = state.modals[id];
      if (!current) return state;
      return {
        modals: { ...state.modals, [id]: { ...current, ...partial } },
      };
    }),

  unregisterModal: (id) =>
    set((state) => {
      const { [id]: _removed, ...rest } = state.modals;
      console.log({_removed});
      
      return { modals: rest };
    }),

  isOpen: (id) => !!get().modals[id]?.show,
}));
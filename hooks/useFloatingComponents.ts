"use client";

import { create } from "zustand";

interface FloatingComponentsState {
  isChatOpen: boolean;
  isWhatsAppVisible: boolean;
  isAdvisorWidgetVisible: boolean;
  setChatOpen: (isOpen: boolean) => void;
  setWhatsAppVisible: (isVisible: boolean) => void;
  setAdvisorWidgetVisible: (isVisible: boolean) => void;
}

export const useFloatingComponents = create<FloatingComponentsState>((set) => ({
  isChatOpen: false,
  isWhatsAppVisible: false,
  isAdvisorWidgetVisible: false,
  setChatOpen: (isOpen: boolean) => set({ isChatOpen: isOpen }),
  setWhatsAppVisible: (isVisible: boolean) =>
    set({ isWhatsAppVisible: isVisible }),
  setAdvisorWidgetVisible: (isVisible: boolean) =>
    set({ isAdvisorWidgetVisible: isVisible }),
}));

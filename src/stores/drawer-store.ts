import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DrawerState {
    open: boolean;
    toggle: () => void;
}

export const useDrawer = create<DrawerState>()(
    persist(
        (set, get) => ({
            open: true,
            toggle: () => set(({ open: !get().open })),

        }),
        {
            name: 'drawer',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
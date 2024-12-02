import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthStore {
    isAuthenticated: boolean,
    verify: () => void;
}

export const useAuth = create<AuthStore>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            verify: async () => {
                // request to /me
            }
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
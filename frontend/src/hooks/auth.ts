import { create } from "zustand"

interface AuthStore {
    isAuthenticated: boolean
}

export const useAuth = create<AuthStore>()(
    (set, get) => ({
        isAuthenticated: false,

        verify: async () => {

        }
    })
)
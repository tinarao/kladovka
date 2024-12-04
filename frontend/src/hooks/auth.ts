import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthStore {
    user?: UserStore
    isAuthenticated: boolean,
    setUser: (u: UserStore) => void
}

export const useAuth = create<AuthStore>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: undefined,
            setUser: (u) => {
                set({ isAuthenticated: true, user: u })
            }
        }),
        {
            name: 'u'
        }
    )
)
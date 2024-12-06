import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthStore {
    user?: UserStore
    setUser: (u: UserStore) => void,
    clear: () => void
}

export const useAuth = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: undefined,
            setUser: (u) => {
                set({ user: u })
            },
            clear: () => set({ user: undefined })
        }),
        {
            name: 'u'
        }
    )
)
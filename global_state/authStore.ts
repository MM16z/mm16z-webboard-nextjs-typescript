import create from "zustand"

interface useAuthStore {
    accessToken: string | null,
    userEmail: string | null,
    userId: number | null,
    userName: string | null,
    setAccessToken: (e: string | null) => void
    setEmailStore: (e: string | null) => void
    setUserId: (e: number | null) => void
    setUserName: (e: string | null) => void
}

const useAuthStore = create<useAuthStore>(set => ({
    accessToken: null,
    userEmail: null,
    userId: null,
    userName: null,
    setAccessToken: (e) => set({ accessToken: e }),
    setEmailStore: (e) => set({ userEmail: e }),
    setUserId: (e) => set({ userId: e }),
    setUserName: (e) => set({ userName: e })
}))

export default useAuthStore;
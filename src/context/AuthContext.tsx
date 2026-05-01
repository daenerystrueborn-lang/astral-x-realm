// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, getProfile, logout as apiLogout, type Player } from '@/lib/api'

interface AuthContextType {
  player: Player | null
  loading: boolean
  modal: 'login' | 'signup' | null
  openLogin: () => void
  openSignup: () => void
  closeModal: () => void
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'login' | 'signup' | null>(null)

  // On first load, check if they already have a valid token
  useEffect(() => {
    getProfile()
      .then(p => setPlayer(p))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const p = await apiLogin(username, password)  // throws with message on failure
    setPlayer(p)
    setModal(null)
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setPlayer(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      player,
      loading,
      modal,
      openLogin:  () => setModal('login'),
      openSignup: () => setModal('signup'),
      closeModal: () => setModal(null),
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { authService } from '@/services/auth.service'
import { User } from '@/interfaces'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isCustomer: boolean
  canCreateProduct: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await authService.login({ email, password })
      
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        return true
      }
      
      setError(response.message || 'Login failed')
      return false
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await authService.register({ name, email, password })
      
      if (response.success) {
        return true
      }
      
      setError(response.message || 'Registration failed')
      return false
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      return false
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setError(null)
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    canCreateProduct: user?.role === 'admin' || user?.role === 'seller',
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { authService } from '@/services/auth.service'
import { User } from '@/interfaces'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: User) => void
  isAuthenticated: boolean
  isAdmin: boolean
  isCustomer: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Khôi phục user từ cookie khi app khởi động
  useEffect(() => {
    const storedUser = authService.getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  // Lắng nghe event từ API interceptor khi token hết hạn (401)
  useEffect(() => {
    const handleAutoLogout = () => {
      setUser(null)
      setError(null)
      // Chuyển hướng về trang login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    window.addEventListener('auth:logout', handleAutoLogout)
    return () => {
      window.removeEventListener('auth:logout', handleAutoLogout)
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

  const updateUser = (newUser: User) => {
    setUser(newUser);
    import('universal-cookie').then((Cookies) => {
      const cookies = new Cookies.default(null, { path: "/" });
      cookies.set("user", newUser, {
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      });
    });
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
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

'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthUser {
  id: string
  el_space_id?: string
  email: string
  name: string
  full_name?: string
  user_type?: 'client' | 'entrepreneur' | 'business' | 'enterprise' | 'freelancer'
  role: 'client' | 'entrepreneur' | 'business' | 'enterprise' | 'freelancer' | 'admin'
  avatar?: string
  avatar_url?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (emailOrUser: any, passwordOrToken?: string) => Promise<void>
  logout: () => Promise<void>
  register: (dataOrUser: any, token?: string) => Promise<void>
  updateUser: (data: Partial<AuthUser>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (emailOrUser: any, passwordOrToken?: string) => {
    try {
      setLoading(true)

      // Support direct login with user object and token (from OTP verification)
      if (typeof emailOrUser === 'object' && emailOrUser !== null) {
        const user = emailOrUser;
        const token = passwordOrToken;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('email', user.email);
        if (token) localStorage.setItem('authToken', token);
        return;
      }

      // Traditional email/password login
      const email = emailOrUser;
      const password = passwordOrToken;
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('email', data.user.email)
        if (data.token) localStorage.setItem('authToken', data.token);
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      localStorage.removeItem('user')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const register = async (dataOrUser: any, token?: string) => {
    try {
      setLoading(true)

      // Support direct registration with user object and token (from OTP verification)
      if (dataOrUser && dataOrUser.id && token) {
        const user = dataOrUser;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('email', user.email);
        localStorage.setItem('authToken', token);
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataOrUser),
      })

      const result = await response.json()
      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('userId', result.user.id)
        localStorage.setItem('email', result.user.email)
        if (result.token) localStorage.setItem('authToken', result.token);
      }
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (data: Partial<AuthUser>) => {
    try {
      setLoading(true)
      if (!user) return

      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (result.success) {
        const updated = { ...user, ...data }
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

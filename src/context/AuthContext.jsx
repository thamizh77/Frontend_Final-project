// client/src/context/AuthContext.jsx
import api from '../api/api'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import {
  onAuthStateChanged,
  getIdToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
} from 'firebase/auth'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const token = await getIdToken(u, true)
          localStorage.setItem('idToken', token)

          // displayName set இல்லன்னா email prefix use பண்ணு
          const fallbackName =
            u.displayName || (u.email ? u.email.split('@')[0] : '')

          setUser({
            uid: u.uid,
            email: u.email,
            displayName: fallbackName,
            photoURL: u.photoURL,
          })
        } catch (err) {
          console.error('getIdToken error', err)
        }
      } else {
        localStorage.removeItem('idToken')
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

    const signup = async (email, password, displayName) => {
    setAuthError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)

      // 1) Firebase user profile-la name set pannuradhu
      if (displayName) {
        try {
          await updateProfile(cred.user, { displayName })
        } catch (upErr) {
          console.warn('profile update failed', upErr)
        }
      }

      // 2) Name decide pannuvom (displayName illa na email prefix)
      const nameToUse =
        displayName || (cred.user.email ? cred.user.email.split('@')[0] : '')

      // 3) Backend /api/users ku user info anuppi MongoDB la store pannuvom
      try {
        await api.post('/users', {
          uid: cred.user.uid,
          email,
          displayName: nameToUse,
        })
      } catch (syncErr) {
        console.warn('Failed to sync user to backend', syncErr)
        // signup success irukalam, so inga throw pannala
      }

      // 4) Context user-um udaney update → navbar la name show aagum
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: nameToUse,
        photoURL: cred.user.photoURL,
      })

      return { ok: true, uid: cred.user.uid }
    } catch (err) {
      setAuthError(err)
      throw err
    }
  }


  const login = async (email, password) => {
    setAuthError(null)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return { ok: true, uid: cred.user.uid }
    } catch (err) {
      setAuthError(err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await fbSignOut(auth)
      localStorage.removeItem('idToken')
      setUser(null)
    } catch (err) {
      console.error('logout error', err)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

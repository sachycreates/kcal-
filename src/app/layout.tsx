'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function SettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [mealReminders, setMealReminders] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('kcal-theme')
    if (saved === 'light') {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    loadProfile()
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('kcal-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('kcal-theme', 'light')
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all ${value ? 'bg-white' : 'bg-gray-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${value ? 'left-7 bg-black' : 'left-1 bg-gray-400'}`} />
    </button>
  )

  const bg = darkMode ? 'bg-black text-white' : 'bg-white text-black'
  const card = darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'
  const divider = darkMode ? 'divide-gray-800' : 'divide-gray-200'
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500'
  const label = darkMode ? 'text-xs text-gray-400' : 'text-xs text-gray-500'
  const navBorder = darkMode ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'
  const navActive = darkMode ? 'text-white' : 'text-black'
  const navInactive = darkMode ? 'text-gray-500' : 'text-gray-400'

  return (
    <div className={`min-h-screen ${bg} pb-24`}>
      <div className="max-w-md mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className={`${subtext} text-sm mt-1`}>Manage your KCAL experience.</p>
        </div>

        {/* Profile card */}
        {profile && (
          <div className={`mb-6 rounded-2xl border ${card} p-5`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center text-lg font-bold`}>
                {profile.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-semibold">{profile.name}</p>
                <p className={`text-sm ${subtext}`}>{profile.goal?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div className="mb-6">
          <p className={`${label} uppercase tracking-widest mb-3`}>Appearance</p>
          <div className={`rounded-2xl border ${card} divide-y ${divider}`}>
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className={`text-xs ${subtext} mt-0.5`}>Easy on the eyes</p>
              </div>
              <Toggle value={darkMode} onChange={toggleDark} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <p className={`${label} uppercase tracking-widest mb-3`}>Notifications</p>
          <div className={`rounded-2xl border ${card} divide-y ${divider}`}>
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium">Push notifications</p>
                <p className={`text-xs ${subtext} mt-0.5`}>Daily plan updates</p>
              </div>
              <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
            </div>
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium">Meal reminders</p>
                <p className={`text-xs ${subtext} mt-0.5`}>Get nudged at meal time</p>
              </div>
              <Toggle value={mealReminders} onChange={() => setMealReminders(!mealReminders)} />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="mb-6">
          <p className={`${label} uppercase tracking-widest mb-3`}>Account</p>
          <div className={`rounded-2xl border ${card} divide-y ${divider}`}>
            <button
              onClick={() => router.push('/onboarding')}
              className={`flex items-center justify-between w-full px-4 py-4 text-left hover:opacity-80 rounded-t-2xl transition-all`}
            >
              <div>
                <p className="text-sm font-medium">Redo onboarding</p>
                <p className={`text-xs ${subtext} mt-0.5`}>Update your goals and preferences</p>
              </div>
              <span className={subtext}>→</span>
            </button>
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium">App version</p>
                <p className={`text-xs ${subtext} mt-0.5`}>KCAL v0.1 — MVP</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded-2xl border border-red-900 bg-red-950 px-4 py-4 text-red-400 text-sm font-medium hover:bg-red-900 transition-all disabled:opacity-50"
        >
          {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>

      </div>

      <div className={`fixed bottom-0 left-0 right-0 border-t ${navBorder}`}>
        <div className="max-w-md mx-auto flex justify-around py-4">
          <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1">
            <span className="text-xl">🏠</span>
            <span className={`text-xs ${navInactive}`}>Home</span>
          </button>
          <button onClick={() => router.push('/streaks')} className="flex flex-col items-center gap-1">
            <span className="text-xl">🔥</span>
            <span className={`text-xs ${navInactive}`}>Streaks</span>
          </button>
          <button onClick={() => router.push('/settings')} className="flex flex-col items-center gap-1">
            <span className="text-xl">⚙️</span>
            <span className={`text-xs ${navActive} font-medium`}>Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
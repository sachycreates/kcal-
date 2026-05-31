'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { getTheme, setTheme, light, dark, type Theme } from '@/lib/theme'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function BottomNav({ t, active }: { t: Theme; active: string }) {
  const router = useRouter()
  const items = [
    { icon: '🏠', label: 'Home', path: '/dashboard' },
    { icon: '📦', label: 'Orders', path: '/orders' },
    { icon: '🔥', label: 'Journey', path: '/streaks' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t" style={{ background: t.navBg, borderColor: t.navBorder }}>
      <div className="max-w-md mx-auto flex justify-around py-4">
        {items.map((item) => {
          const isActive = item.path === active
          return (
            <button key={item.path} onClick={() => router.push(item.path)} className="flex flex-col items-center gap-1">
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px]" style={{ color: isActive ? t.accent : t.textTertiary, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full" style={{ background: t.accent }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [t, setT] = useState<Theme>(light)
  const [isDark, setIsDark] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [mealReminders, setMealReminders] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const savedTheme = getTheme()
    const dark_ = savedTheme === 'dark'
    setIsDark(dark_)
    setT(dark_ ? dark : light)
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? null)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    loadProfile()
  }, [])

  const toggleDark = () => {
    const next = !isDark
    setIsDark(next)
    setTheme(next ? 'dark' : 'light')
    setT(next ? dark : light)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const goalLabel = (goal: string) => {
    const map: Record<string, string> = {
      weight_loss: 'Lose weight',
      muscle: 'Build muscle',
      energy: 'Stay energised',
      consistency: 'Eat consistently',
    }
    return map[goal] ?? goal?.replace(/_/g, ' ')
  }

  const Toggle = ({ value, onChange, accent }: { value: boolean; onChange: () => void; accent?: boolean }) => (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-all duration-300"
      style={{ background: value ? t.accent : t.border }}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full transition-all duration-300"
        style={{ background: '#fff', left: value ? '23px' : '4px' }}
      />
    </button>
  )

  return (
    <div className="min-h-screen pb-28 transition-colors duration-300" style={{ background: t.bg }}>
      <div className="max-w-md mx-auto px-5 pt-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: t.textPrimary }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: t.textSecondary }}>Manage your KCAL experience.</p>
        </div>

        {/* Profile card */}
        {profile ? (
          <div className="mb-6 rounded-2xl border p-5" style={{ background: t.surface, borderColor: t.border }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: t.accent, color: t.accentText }}>
                {profile.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-semibold text-lg" style={{ color: t.textPrimary }}>{profile.name}</p>
                {email && <p className="text-sm" style={{ color: t.textSecondary }}>{email}</p>}
              </div>
            </div>
            <div className="border-t pt-4 grid grid-cols-2 gap-3" style={{ borderColor: t.border }}>
              {[
                { label: 'Goal', value: goalLabel(profile.goal) },
                { label: 'Daily target', value: profile.daily_calorie_goal ? `${profile.daily_calorie_goal} kcal` : '—' },
                { label: 'Diet', value: profile.diet_type?.replace(/_/g, ' ') ?? '—' },
                { label: 'Wake time', value: profile.wake_time ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl px-3 py-2" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                  <p className="text-xs mb-0.5 capitalize" style={{ color: t.textTertiary }}>{label}</p>
                  <p className="text-sm font-medium capitalize" style={{ color: t.textPrimary }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border p-5 animate-pulse" style={{ background: t.surface, borderColor: t.border }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full" style={{ background: t.border }} />
              <div className="flex-1">
                <div className="h-4 rounded w-1/2 mb-2" style={{ background: t.border }} />
                <div className="h-3 rounded w-2/3" style={{ background: t.border }} />
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: t.textTertiary }}>Appearance</p>
          <div className="rounded-2xl border divide-y" style={{ background: t.surface, borderColor: t.border, '--divide-color': t.border } as any}>
            <div className="flex items-center justify-between px-4 py-4" style={{ borderColor: t.border }}>
              <div>
                <p className="text-sm font-medium" style={{ color: t.textPrimary }}>Dark mode</p>
                <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>Switch to a darker look</p>
              </div>
              <Toggle value={isDark} onChange={toggleDark} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: t.textTertiary }}>Notifications</p>
          <div className="rounded-2xl border" style={{ background: t.surface, borderColor: t.border }}>
            {[
              { label: 'Push notifications', desc: 'Daily plan updates', value: notifications, onChange: () => setNotifications(!notifications) },
              { label: 'Meal reminders', desc: 'Get nudged at meal time', value: mealReminders, onChange: () => setMealReminders(!mealReminders) },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-4" style={{ borderTop: i > 0 ? `1px solid ${t.border}` : 'none' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: t.textPrimary }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>{item.desc}</p>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: t.textTertiary }}>Account</p>
          <div className="rounded-2xl border" style={{ background: t.surface, borderColor: t.border }}>
            <button
              onClick={() => router.push('/onboarding')}
              className="flex items-center justify-between w-full px-4 py-4 text-left transition-all rounded-t-2xl"
              style={{ borderBottom: `1px solid ${t.border}` }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: t.textPrimary }}>Redo onboarding</p>
                <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>Update your goals and preferences</p>
              </div>
              <span style={{ color: t.textTertiary }}>→</span>
            </button>
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium" style={{ color: t.textPrimary }}>App version</p>
                <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>KCAL v0.1 — MVP</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded-2xl px-4 py-4 text-sm font-medium transition-all disabled:opacity-50"
          style={{ background: t.dangerBg, border: `1px solid ${t.dangerBorder}`, color: t.danger }}
        >
          {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>

      </div>
      <BottomNav t={t} active="/settings" />
    </div>
  )
}
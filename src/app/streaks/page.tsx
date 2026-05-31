'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { getTheme, light, dark, type Theme } from '@/lib/theme'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const milestones = [
  { day: 5, reward: 'Nutrition Drop 🌱', desc: 'A curated seed bag — fuelling your habit' },
  { day: 7, reward: 'Cheat Meal Unlocked 🍕', desc: 'One free cheat meal, fully on us' },
  { day: 21, reward: 'Consistency Badge 🏅', desc: 'You built a real habit. Wear it.' },
  { day: 30, reward: 'Legend Merch Drop 👕', desc: 'Exclusive KCAL merch, just for you' },
]

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

export default function StreaksPage() {
  const router = useRouter()
  const [t, setT] = useState<Theme>(light)
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set())
  const [currentStreak, setCurrentStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setT(getTheme() === 'dark' ? dark : light)
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: events } = await supabase.from('meal_events').select('logged_at').eq('user_id', user.id)
      if (events) {
        const dates = new Set(events.map((e: any) => e.logged_at))
        setLoggedDates(dates)
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 365; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          const key = d.toISOString().split('T')[0]
          if (dates.has(key)) streak++
          else break
        }
        setCurrentStreak(streak)
      }
      setLoading(false)
    }
    load()
  }, [])

  const today = new Date()
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (27 - i))
    const key = date.toISOString().split('T')[0]
    return {
      logged: loggedDates.has(key),
      isToday: i === 27,
      label: date.toLocaleDateString('en-IN', { weekday: 'short' })[0],
      day: date.getDate(),
    }
  })

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: t.bg }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: t.accent, borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="min-h-screen pb-28 transition-colors duration-300" style={{ background: t.bg }}>
      <div className="max-w-md mx-auto px-5 pt-10">

        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: t.textPrimary }}>Your journey</h1>
          <p className="text-sm mt-1" style={{ color: t.textSecondary }}>Every meal ordered counts.</p>
        </div>

        {/* Streak hero */}
        <div className="rounded-2xl border p-6 text-center mb-6" style={{ background: t.surface, borderColor: t.border }}>
          <div className="text-7xl font-black mb-2" style={{ color: t.textPrimary }}>{currentStreak}</div>
          <p className="text-sm" style={{ color: t.textSecondary }}>
            day{currentStreak !== 1 ? 's' : ''} on track <span style={{ color: t.accent }}>🔥</span>
          </p>
          <p className="text-xs mt-3" style={{ color: t.textTertiary }}>
            {currentStreak === 0 ? 'Order a meal today to start your streak' : 'Order all meals today to keep it going'}
          </p>
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: t.textTertiary }}>Last 28 days</p>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px]" style={{ color: t.textTertiary }}>{d.label}</span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-medium transition-all"
                  style={{
                    background: d.isToday ? 'transparent' : d.logged ? t.accent : t.surface,
                    border: d.isToday ? `2px solid ${t.accent}` : `1px solid ${d.logged ? t.accent : t.border}`,
                    color: d.isToday ? t.accent : d.logged ? t.accentText : t.textTertiary,
                  }}
                >
                  {d.day}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            {[
              { color: t.accent, label: 'On track' },
              { color: t.surface, label: 'Missed', border: true },
              { color: 'transparent', label: 'Today', border: true, borderColor: t.accent },
            ].map((leg) => (
              <div key={leg.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: leg.color, border: leg.border ? `1.5px solid ${leg.borderColor || t.border}` : 'none' }} />
                <span className="text-xs" style={{ color: t.textSecondary }}>{leg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: t.textTertiary }}>Milestones</p>
          <div className="space-y-3">
            {milestones.map((m, i) => {
              const achieved = currentStreak >= m.day
              const progress = Math.min(Math.round((currentStreak / m.day) * 100), 100)
              return (
                <div
                  key={i}
                  className="rounded-2xl border p-4 transition-all"
                  style={{
                    background: achieved ? t.accent : t.surface,
                    borderColor: achieved ? t.accent : t.border,
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: achieved ? t.accentText : t.textPrimary }}>{m.reward}</p>
                      <p className="text-xs mt-0.5" style={{ color: achieved ? t.accentText : t.textSecondary, opacity: achieved ? 0.85 : 1 }}>{m.desc}</p>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full ml-3 flex-shrink-0"
                      style={{
                        background: achieved ? 'rgba(0,0,0,0.15)' : t.border,
                        color: achieved ? t.accentText : t.textSecondary,
                      }}
                    >
                      Day {m.day}
                    </span>
                  </div>
                  {!achieved && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full" style={{ background: t.border }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: t.accent }} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: t.textTertiary }}>{currentStreak} / {m.day} days</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
      <BottomNav t={t} active="/streaks" />
    </div>
  )
}
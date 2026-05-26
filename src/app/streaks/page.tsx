'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const milestones = [
  { day: 5, reward: 'Nutrition Drop 🌱', desc: 'A curated seeded bag' },
  { day: 7, reward: 'Cheat Meal Unlocked 🍕', desc: 'One free cheat meal on us' },
  { day: 21, reward: 'Consistency Badge 🏅', desc: 'You built a real habit' },
  { day: 30, reward: 'Legend Merch Drop 👕', desc: 'Exclusive KCAL merch' },
]

export default function StreaksPage() {
  const router = useRouter()
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set())
  const [currentStreak, setCurrentStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: events } = await supabase
        .from('meal_events')
        .select('logged_at')
        .eq('user_id', user.id)

      if (events) {
        const dates = new Set(events.map((e: any) => e.logged_at))
        setLoggedDates(dates)

        // Calculate streak
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 365; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          const key = d.toISOString().split('T')[0]
          if (dates.has(key)) {
            streak++
          } else {
            break
          }
        }
        setCurrentStreak(streak)
      }

      setLoading(false)
    }
    load()
  }, [])

  // Generate last 28 days
  const today = new Date()
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (27 - i))
    const key = date.toISOString().split('T')[0]
    return {
      date,
      logged: loggedDates.has(key),
      isToday: i === 27,
      label: date.toLocaleDateString('en-IN', { weekday: 'short' })[0],
      day: date.getDate(),
    }
  })

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="text-gray-400">Loading your streak...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-md mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your streak</h1>
          <p className="text-gray-400 text-sm mt-1">Every meal logged counts.</p>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 text-center">
          <p className="text-7xl font-black mb-2">{currentStreak}</p>
          <p className="text-gray-400 text-sm">days on track 🔥</p>
          <p className="text-xs text-gray-600 mt-3">
            {currentStreak === 0 ? 'Log a meal today to start your streak' : 'Log all meals today to keep it going'}
          </p>
        </div>

        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Last 28 days</p>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-600">{d.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${
                  d.isToday
                    ? 'border-2 border-white bg-transparent text-white'
                    : d.logged
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-600'
                }`}>
                  {d.day}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white" />
              <span className="text-xs text-gray-400">On track</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-800" />
              <span className="text-xs text-gray-400">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2 border-white" />
              <span className="text-xs text-gray-400">Today</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Milestones</p>
          <div className="space-y-3">
            {milestones.map((m, i) => {
              const achieved = currentStreak >= m.day
              const progress = Math.min(Math.round((currentStreak / m.day) * 100), 100)
              return (
                <div key={i} className={`rounded-2xl border p-4 transition-all ${achieved ? 'border-white bg-white text-black' : 'border-gray-800 bg-gray-900'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`text-sm font-semibold ${achieved ? 'text-black' : 'text-white'}`}>{m.reward}</p>
                      <p className={`text-xs mt-0.5 ${achieved ? 'text-gray-700' : 'text-gray-400'}`}>{m.desc}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${achieved ? 'bg-black text-white' : 'bg-gray-800 text-gray-400'}`}>
                      Day {m.day}
                    </span>
                  </div>
                  {!achieved && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-gray-700">
                        <div className="h-1.5 rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{currentStreak} / {m.day} days</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black">
        <div className="max-w-md mx-auto flex justify-around py-4">
          <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1">
            <span className="text-gray-500 text-xl">🏠</span>
            <span className="text-xs text-gray-500">Home</span>
          </button>
          <button onClick={() => router.push('/streaks')} className="flex flex-col items-center gap-1">
            <span className="text-white text-xl">🔥</span>
            <span className="text-xs text-white font-medium">Streaks</span>
          </button>
          <button onClick={() => router.push('/settings')} className="flex flex-col items-center gap-1">
            <span className="text-gray-500 text-xl">⚙️</span>
            <span className="text-xs text-gray-500">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
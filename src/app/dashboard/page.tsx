'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function getMeals(wakeTime: string, goal: string) {
  const [hours, minutes] = wakeTime.split(':').map(Number)
  const wake = hours * 60 + minutes

  const toTimeString = (mins: number) => {
    const h = Math.floor(mins / 60) % 24
    const m = mins % 60
    const ampm = h >= 12 ? 'PM' : 'AM'
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${display}:${m.toString().padStart(2, '0')} ${ampm}`
  }

  const mealsByGoal: Record<string, any[]> = {
    muscle: [
      { label: 'Breakfast', time: wake + 30, name: 'Paneer Paratha + Curd', kcal: 520, protein: 24 },
      { label: 'Lunch', time: wake + 270, name: 'Dal + Rice + Sabzi + Egg', kcal: 680, protein: 32 },
      { label: 'Snack', time: wake + 420, name: 'Boiled Eggs + Banana', kcal: 220, protein: 14 },
      { label: 'Dinner', time: 20 * 60, name: 'Chicken/Tofu Stir Fry + Roti', kcal: 580, protein: 36 },
    ],
    weight_loss: [
      { label: 'Breakfast', time: wake + 30, name: 'Poha + Green Tea', kcal: 280, protein: 8 },
      { label: 'Lunch', time: wake + 270, name: 'Salad + Dal + 1 Roti', kcal: 420, protein: 16 },
      { label: 'Snack', time: wake + 420, name: 'Handful of Nuts + Fruit', kcal: 160, protein: 5 },
      { label: 'Dinner', time: 20 * 60, name: 'Soup + Grilled Veggies', kcal: 320, protein: 12 },
    ],
    energy: [
      { label: 'Breakfast', time: wake + 30, name: 'Banana + Peanut Butter Toast', kcal: 380, protein: 12 },
      { label: 'Lunch', time: wake + 270, name: 'Rajma Rice + Salad', kcal: 540, protein: 20 },
      { label: 'Snack', time: wake + 420, name: 'Dates + Almonds', kcal: 180, protein: 4 },
      { label: 'Dinner', time: 20 * 60, name: 'Khichdi + Ghee', kcal: 460, protein: 16 },
    ],
    consistency: [
      { label: 'Breakfast', time: wake + 30, name: 'Idli + Sambar', kcal: 320, protein: 10 },
      { label: 'Lunch', time: wake + 270, name: 'Thali (Dal + Rice + Sabzi)', kcal: 580, protein: 18 },
      { label: 'Snack', time: wake + 420, name: 'Sprouts Chaat', kcal: 180, protein: 8 },
      { label: 'Dinner', time: 20 * 60, name: 'Roti + Sabzi + Curd', kcal: 480, protein: 15 },
    ],
  }

  const meals = mealsByGoal[goal] || mealsByGoal.consistency
  return meals.map(m => ({ ...m, timeString: toTimeString(m.time) }))
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [logged, setLogged] = useState<Record<number, boolean>>({})
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)

      const today = new Date().toISOString().split('T')[0]
      const { data: events } = await supabase
        .from('meal_events')
        .select('meal_label')
        .eq('user_id', user.id)
        .eq('logged_at', today)

      if (events) {
        const meals = getMeals(data?.wake_time || '07:00', data?.goal || 'consistency')
        const loggedMap: Record<number, boolean> = {}
        events.forEach(e => {
          const idx = meals.findIndex(m => m.label === e.meal_label)
          if (idx !== -1) loggedMap[idx] = true
        })
        setLogged(loggedMap)
      }

      setLoading(false)
    }
    loadProfile()
  }, [])

  const toggleLog = async (meal: any, index: number) => {
    const today = new Date().toISOString().split('T')[0]
    const isLogged = logged[index]

    if (!isLogged) {
      await supabase.from('meal_events').insert({
        user_id: userId,
        meal_label: meal.label,
        meal_name: meal.name,
        kcal: meal.kcal,
        protein: meal.protein,
        logged_at: today,
      })
    } else {
      await supabase.from('meal_events')
        .delete()
        .eq('user_id', userId)
        .eq('meal_label', meal.label)
        .eq('logged_at', today)
    }

    setLogged(prev => ({ ...prev, [index]: !isLogged }))
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="text-gray-400">Loading your plan...</p>
    </div>
  )

  const meals = getMeals(profile?.wake_time || '07:00', profile?.goal || 'consistency')
  const totalKcal = meals.reduce((sum, m) => sum + m.kcal, 0)
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0)
  const loggedKcal = meals.filter((_, i) => logged[i]).reduce((sum, m) => sum + m.kcal, 0)
  const loggedProtein = meals.filter((_, i) => logged[i]).reduce((sum, m) => sum + m.protein, 0)
  const firstName = profile?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const caloriePercent = Math.min(Math.round((loggedKcal / totalKcal) * 100), 100)
  const proteinPercent = Math.min(Math.round((loggedProtein / totalProtein) * 100), 100)

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-md mx-auto px-4 py-8">

        <div className="mb-6">
          <p className="text-gray-400 text-sm">{greeting}</p>
          <h1 className="text-3xl font-bold">{firstName} 👋</h1>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Today's breakdown</p>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white font-medium">Calories</span>
              <span className="text-gray-400">{loggedKcal} / {totalKcal} kcal</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-700">
              <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${caloriePercent}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white font-medium">Protein</span>
              <span className="text-gray-400">{loggedProtein}g / {totalProtein}g</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-700">
              <div className="h-2 rounded-full bg-green-400 transition-all" style={{ width: `${proteinPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Today's meals</h2>
          <div className="space-y-3">
            {meals.map((meal, i) => (
              <div key={i} className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition-all ${logged[i] ? 'border-green-500 bg-green-950' : 'border-gray-800 bg-gray-900'}`}>
                <div>
                  <p className="text-xs text-gray-400 mb-1">{meal.label} · {meal.timeString}</p>
                  <p className="text-sm font-medium">{meal.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{meal.protein}g protein</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300 mb-2">{meal.kcal} kcal</p>
                  <button
                    onClick={() => toggleLog(meal, i)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${logged[i] ? 'border-green-500 text-green-400 bg-green-950' : 'border-gray-600 text-gray-400 hover:border-white hover:text-white'}`}
                  >
                    {logged[i] ? 'Logged ✓' : 'Log'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">KCAL is learning</p>
          <p className="text-sm text-white">
            Your plan is anchored to your <span className="font-semibold">{profile?.wake_time} wake time</span>. Log meals to help KCAL adapt tomorrow's plan.
          </p>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black">
        <div className="max-w-md mx-auto flex justify-around py-4">
          <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1">
            <span className="text-white text-xl">🏠</span>
            <span className="text-xs text-white font-medium">Home</span>
          </button>
          <button onClick={() => router.push('/streaks')} className="flex flex-col items-center gap-1">
            <span className="text-gray-500 text-xl">🔥</span>
            <span className="text-xs text-gray-500">Streaks</span>
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
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const MEAL_DB: Record<string, any[]> = {
  muscle: [
    { label: 'Breakfast', name: 'Paneer Paratha with Curd', kcal: 520, protein: 24, carbs: 48, price: 130, alts: ['Quinoa Upma with Paneer Cubes', 'Moong Dal Chilla with Paneer'] },
    { label: 'Lunch', name: 'Chicken Dal with Brown Rice', kcal: 680, protein: 42, carbs: 62, price: 180, alts: ['Grilled Chicken with Dal and Salad', 'Chicken Pulao with Raita'] },
    { label: 'Snack', name: 'Chicken Tikka Skewers', kcal: 220, protein: 28, carbs: 6, price: 120, alts: ['Boiled Egg with Chaat Masala', 'Paneer Tikka Skewers'] },
    { label: 'Dinner', name: 'Grilled Fish with Stir-Fried Vegetables', kcal: 480, protein: 38, carbs: 22, price: 200, alts: ['Egg and Spinach Curry with Roti', 'Chicken Stew with Brown Rice'] },
  ],
  weight_loss: [
    { label: 'Breakfast', name: 'Moong Dal Chilla with Paneer', kcal: 280, protein: 18, carbs: 28, price: 110, alts: ['Ragi Idlis with Sambar', 'Sprouted Moong Salad with Peanuts'] },
    { label: 'Lunch', name: 'Palak Paneer with 2 Rotis', kcal: 380, protein: 20, carbs: 42, price: 150, alts: ['Dal Tadka with Brown Rice', 'Soya Keema with Roti and Raita'] },
    { label: 'Snack', name: 'Roasted Chana Chaat', kcal: 140, protein: 8, carbs: 22, price: 80, alts: ['Makhana with Ghee and Rock Salt', 'Sprouted Moong Chaat'] },
    { label: 'Dinner', name: 'Moong Dal Soup with Roti', kcal: 300, protein: 16, carbs: 38, price: 120, alts: ['Palak Soup with Whole Wheat Toast', 'Dal Khichdi with Ghee'] },
  ],
  energy: [
    { label: 'Breakfast', name: 'Besan Chilla with Chutney', kcal: 340, protein: 16, carbs: 38, price: 100, alts: ['Paneer Bhurji on Whole Wheat Toast', 'Tandoori Paneer Sandwich'] },
    { label: 'Lunch', name: 'Rajma Chawal with Pickled Onions', kcal: 540, protein: 22, carbs: 72, price: 140, alts: ['Chole with Jeera Rice', 'Mixed Vegetable Khichdi with Ghee'] },
    { label: 'Snack', name: 'Banana with Peanut Butter', kcal: 180, protein: 6, carbs: 28, price: 70, alts: ['Dates and Almonds', 'Multigrain Khakhra with Hummus'] },
    { label: 'Dinner', name: 'Paneer and Vegetable Stir Fry with Quinoa', kcal: 420, protein: 24, carbs: 36, price: 170, alts: ['Methi Thepla with Curd', 'Baingan Bharta with Roti'] },
  ],
  consistency: [
    { label: 'Breakfast', name: 'Ragi Idlis with Sambar', kcal: 300, protein: 12, carbs: 52, price: 100, alts: ['Besan Chilla with Chutney', 'Quinoa Upma with Paneer Cubes'] },
    { label: 'Lunch', name: 'Dal Tadka with Brown Rice and Salad', kcal: 520, protein: 20, carbs: 68, price: 140, alts: ['Palak Paneer with 2 Rotis', 'Chole with Jeera Rice'] },
    { label: 'Snack', name: 'Makhana with Ghee and Rock Salt', kcal: 150, protein: 5, carbs: 18, price: 80, alts: ['Roasted Chana Chaat', 'Sprouted Moong Chaat'] },
    { label: 'Dinner', name: 'Roti with Sabzi and Curd', kcal: 440, protein: 16, carbs: 58, price: 130, alts: ['Dal Khichdi with Ghee', 'Moong Dal Soup with Roti'] },
  ],
}

const MEAL_COLORS = ['#2d1e10', '#1a2e1e', '#2a1a2e', '#1e2a1a']
const MEAL_ICONS = ['☀️', '🌿', '🍵', '🌙']

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [swapIndex, setSwapIndex] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ordered, setOrdered] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e0c0a]">
      <div className="text-center">
        <div className="w-8 h-8 border border-[#c8714a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[#5a5248] text-sm">Curating your plan...</p>
      </div>
    </div>
  )

  const goal = profile?.goal || 'consistency'
  const meals = MEAL_DB[goal] || MEAL_DB.consistency
  const firstName = profile?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const selectedMeals = meals.filter((_, i) => selected[i])
  const totalKcal = selectedMeals.reduce((s, m) => s + m.kcal, 0)
  const totalProtein = selectedMeals.reduce((s, m) => s + m.protein, 0)
  const totalCarbs = selectedMeals.reduce((s, m) => s + m.carbs, 0)
  const totalPrice = selectedMeals.reduce((s, m) => s + m.price, 0)

  const dayKcal = meals.reduce((s, m) => s + m.kcal, 0)
  const kcalPercent = Math.round((totalKcal / dayKcal) * 100)
  const circumference = 2 * Math.PI * 36
  const strokeDash = (kcalPercent / 100) * circumference

  const toggleSelect = (i: number) => {
    setSelected(prev => ({ ...prev, [i]: !prev[i] }))
  }

  const swapMeal = (index: number, altName: string) => {
    // In real app this would update the curated plan
    setSwapIndex(null)
  }

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white pb-28">

      {/* Header */}
      <div className="px-5 pt-10 pb-4 max-w-md mx-auto">
        <p className="text-[#7a6f65] text-xs tracking-widest uppercase mb-1">{greeting}</p>
        <h1 className="text-3xl font-bold text-[#f0ebe4]">{firstName} 👋</h1>
      </div>

      {/* Calorie ring + macros */}
      <div className="mx-5 max-w-md mx-auto mb-6">
        <div className="bg-[#161310] border border-[#252118] rounded-2xl p-5 flex items-center gap-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#252118" strokeWidth="5" />
              <circle
                cx="40" cy="40" r="36" fill="none"
                stroke="#c8714a" strokeWidth="5"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-[#f0ebe4]">{kcalPercent}%</span>
              <span className="text-[10px] text-[#7a6f65]">selected</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-[#5a5248] uppercase tracking-widest mb-3">Today's nutrition</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9a8f82]">Calories</span>
                  <span className="text-[#c8bfb5]">{totalKcal} / {dayKcal}</span>
                </div>
                <div className="h-1 bg-[#252118] rounded-full">
                  <div className="h-1 bg-[#c8714a] rounded-full transition-all duration-700" style={{ width: `${kcalPercent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9a8f82]">Protein</span>
                  <span className="text-[#c8bfb5]">{totalProtein}g</span>
                </div>
                <div className="h-1 bg-[#252118] rounded-full">
                  <div className="h-1 bg-[#7a9e72] rounded-full transition-all duration-700" style={{ width: `${Math.min((totalProtein / 60) * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9a8f82]">Carbs</span>
                  <span className="text-[#c8bfb5]">{totalCarbs}g</span>
                </div>
                <div className="h-1 bg-[#252118] rounded-full">
                  <div className="h-1 bg-[#7a8fbe] rounded-full transition-all duration-700" style={{ width: `${Math.min((totalCarbs / 150) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="px-5 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-[#5a5248] uppercase tracking-widest">Today's curated meals</p>
          {Object.values(selected).some(Boolean) && (
            <p className="text-xs text-[#c8714a]">{Object.values(selected).filter(Boolean).length} selected · ₹{totalPrice}</p>
          )}
        </div>

        <div className="space-y-3">
          {meals.map((meal, i) => (
            <div key={i}>
              <div
                onClick={() => toggleSelect(i)}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                  selected[i]
                    ? 'border-[#c8714a] bg-[#1e1410]'
                    : 'border-[#252118] bg-[#161310]'
                }`}
              >
                {/* Meal color band */}
                <div className="h-1 w-full" style={{ background: selected[i] ? '#c8714a' : MEAL_COLORS[i] }} />

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{MEAL_ICONS[i]}</span>
                        <span className="text-[10px] text-[#5a5248] uppercase tracking-widest">{meal.label}</span>
                        {selected[i] && <span className="text-[10px] text-[#c8714a]">✓ Selected</span>}
                      </div>
                      <p className="text-sm font-semibold text-[#e8e0d5] leading-snug">{meal.name}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-[10px] text-[#7a6f65]">{meal.kcal} kcal</span>
                        <span className="text-[10px] text-[#7a6f65]">{meal.protein}g protein</span>
                        <span className="text-[10px] text-[#7a6f65]">{meal.carbs}g carbs</span>
                      </div>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-sm font-semibold text-[#c8bfb5]">₹{meal.price}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSwapIndex(i) }}
                        className="mt-2 text-[10px] text-[#5a5248] border border-[#2a2520] rounded-full px-3 py-1 hover:border-[#5a5248] hover:text-[#9a8f82] transition-all"
                      >
                        Swap
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap panel */}
              {swapIndex === i && (
                <div className="mt-2 bg-[#161310] border border-[#2a2520] rounded-2xl p-4">
                  <p className="text-[10px] text-[#5a5248] uppercase tracking-widest mb-3">Choose an alternative</p>
                  <div className="space-y-2">
                    {meal.alts.map((alt: string, j: number) => (
                      <button
                        key={j}
                        onClick={() => swapMeal(i, alt)}
                        className="w-full text-left text-sm text-[#c8bfb5] px-3 py-3 rounded-xl border border-[#252118] hover:border-[#c8714a] hover:text-[#f0ebe4] transition-all"
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSwapIndex(null)}
                    className="mt-3 text-xs text-[#5a5248] hover:text-[#9a8f82] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order button — always visible */}
        <div className="mt-6">
          {Object.values(selected).some(Boolean) ? (
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full bg-[#c8714a] text-white rounded-2xl py-4 font-semibold text-sm hover:bg-[#b5623d] transition-all"
            >
              Order {Object.values(selected).filter(Boolean).length} meal{Object.values(selected).filter(Boolean).length > 1 ? 's' : ''} · ₹{totalPrice}
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-[#1c1916] text-[#5a5248] rounded-2xl py-4 font-semibold text-sm border border-[#252118] cursor-default"
            >
              Select meals to order
            </button>
          )}
        </div>

        {/* KCAL note */}
        <div className="mt-4 mb-6 px-4 py-3 rounded-xl bg-[#161310] border border-[#252118]">
          <p className="text-[10px] text-[#5a5248] leading-relaxed">
            Curated for your <span className="text-[#9a8f82]">{goal.replace('_', ' ')}</span> goal · Based on your wake time of <span className="text-[#9a8f82]">{profile?.wake_time || '—'}</span>
          </p>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-[#161310] border border-[#252118] rounded-t-3xl p-6 pb-10">
            <div className="w-10 h-1 bg-[#3a3028] rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-bold text-[#f0ebe4] mb-1">Confirm your order?</h2>
            <p className="text-sm text-[#7a6f65] mb-6">
              {Object.values(selected).filter(Boolean).length} meal{Object.values(selected).filter(Boolean).length > 1 ? 's' : ''} · ₹{totalPrice} total
            </p>
            <div className="space-y-2 mb-6">
              {meals.filter((_, i) => selected[i]).map((m, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#9a8f82]">{m.label} — {m.name}</span>
                  <span className="text-[#c8bfb5]">₹{m.price}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-2xl border border-[#2a2520] py-4 text-[#7a6f65] text-sm hover:border-[#5a5248] transition-all"
              >
                No, go back
              </button>
              <button
                onClick={() => { setConfirmOpen(false); setOrdered(true); router.push('/orders') }}
                className="flex-1 rounded-2xl bg-[#c8714a] py-4 text-white font-semibold text-sm hover:bg-[#b5623d] transition-all"
              >
                Yes, place order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#1e1b18] bg-[#0e0c0a]">
        <div className="max-w-md mx-auto flex justify-around py-4">
          {[
            { icon: '🏠', label: 'Home', path: '/dashboard' },
            { icon: '📦', label: 'Orders', path: '/orders' },
            { icon: '🔥', label: 'Journey', path: '/streaks' },
            { icon: '⚙️', label: 'Settings', path: '/settings' },
          ].map((item) => {
            const active = item.path === '/dashboard'
            return (
              <button key={item.path} onClick={() => router.push(item.path)} className="flex flex-col items-center gap-1">
                <span className="text-lg">{item.icon}</span>
                <span className={`text-[10px] ${active ? 'text-[#c8714a]' : 'text-[#5a5248]'}`}>{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-[#c8714a]" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
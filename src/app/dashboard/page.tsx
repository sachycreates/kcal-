'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const MEAL_DB: Record<string, any[]> = {
  muscle: [
    { label: 'Breakfast', name: 'Paneer Paratha with Curd', kcal: 520, protein: 24, carbs: 48, price: 130, alts: [
      { name: 'Quinoa Upma with Paneer Cubes', kcal: 480, protein: 22, carbs: 52, price: 140 },
      { name: 'Moong Dal Chilla with Paneer', kcal: 460, protein: 26, carbs: 44, price: 120 },
      { name: 'Egg Bhurji on Whole Wheat Toast', kcal: 440, protein: 28, carbs: 38, price: 120 },
    ]},
    { label: 'Lunch', name: 'Chicken Dal with Brown Rice', kcal: 680, protein: 42, carbs: 62, price: 180, alts: [
      { name: 'Grilled Chicken with Dal and Salad', kcal: 620, protein: 46, carbs: 40, price: 190 },
      { name: 'Chicken Pulao with Raita', kcal: 660, protein: 38, carbs: 70, price: 170 },
      { name: 'Tandoori Chicken with Salad', kcal: 580, protein: 50, carbs: 18, price: 200 },
    ]},
    { label: 'Snack', name: 'Chicken Tikka Skewers', kcal: 220, protein: 28, carbs: 6, price: 120, alts: [
      { name: 'Boiled Egg with Chaat Masala', kcal: 160, protein: 18, carbs: 4, price: 70 },
      { name: 'Paneer Tikka Skewers', kcal: 200, protein: 20, carbs: 8, price: 110 },
      { name: 'Tuna on Multigrain Crackers', kcal: 180, protein: 22, carbs: 12, price: 130 },
    ]},
    { label: 'Dinner', name: 'Grilled Fish with Stir-Fried Vegetables', kcal: 480, protein: 38, carbs: 22, price: 200, alts: [
      { name: 'Egg and Spinach Curry with Roti', kcal: 440, protein: 30, carbs: 42, price: 160 },
      { name: 'Chicken Stew with Brown Rice', kcal: 520, protein: 40, carbs: 48, price: 190 },
      { name: 'Mutton Seekh Kebab with Salad', kcal: 500, protein: 42, carbs: 14, price: 230 },
    ]},
  ],
  weight_loss: [
    { label: 'Breakfast', name: 'Moong Dal Chilla with Paneer', kcal: 280, protein: 18, carbs: 28, price: 110, alts: [
      { name: 'Ragi Idlis with Sambar', kcal: 260, protein: 12, carbs: 48, price: 100 },
      { name: 'Sprouted Moong Salad with Peanuts', kcal: 220, protein: 14, carbs: 24, price: 110 },
      { name: 'Besan Chilla with Chutney', kcal: 300, protein: 14, carbs: 34, price: 100 },
    ]},
    { label: 'Lunch', name: 'Palak Paneer with 2 Rotis', kcal: 380, protein: 20, carbs: 42, price: 150, alts: [
      { name: 'Dal Tadka with Brown Rice', kcal: 420, protein: 18, carbs: 62, price: 140 },
      { name: 'Soya Keema with Roti and Raita', kcal: 400, protein: 26, carbs: 44, price: 150 },
      { name: 'Mixed Vegetable Khichdi with Ghee', kcal: 360, protein: 14, carbs: 58, price: 130 },
    ]},
    { label: 'Snack', name: 'Roasted Chana Chaat', kcal: 140, protein: 8, carbs: 22, price: 80, alts: [
      { name: 'Makhana with Ghee and Rock Salt', kcal: 120, protein: 4, carbs: 16, price: 90 },
      { name: 'Sprouted Moong Chaat', kcal: 130, protein: 10, carbs: 18, price: 80 },
      { name: 'Multigrain Khakhra with Hummus', kcal: 150, protein: 6, carbs: 20, price: 100 },
    ]},
    { label: 'Dinner', name: 'Moong Dal Soup with Roti', kcal: 300, protein: 16, carbs: 38, price: 120, alts: [
      { name: 'Palak Soup with Whole Wheat Toast', kcal: 260, protein: 12, carbs: 30, price: 110 },
      { name: 'Dal Khichdi with Ghee', kcal: 340, protein: 14, carbs: 52, price: 120 },
      { name: 'Baingan Bharta with Roti', kcal: 320, protein: 10, carbs: 46, price: 130 },
    ]},
  ],
  energy: [
    { label: 'Breakfast', name: 'Besan Chilla with Chutney', kcal: 340, protein: 16, carbs: 38, price: 100, alts: [
      { name: 'Paneer Bhurji on Whole Wheat Toast', kcal: 360, protein: 20, carbs: 34, price: 120 },
      { name: 'Tandoori Paneer Sandwich', kcal: 380, protein: 18, carbs: 42, price: 130 },
      { name: 'Quinoa Upma with Paneer Cubes', kcal: 320, protein: 16, carbs: 44, price: 130 },
    ]},
    { label: 'Lunch', name: 'Rajma Chawal with Pickled Onions', kcal: 540, protein: 22, carbs: 72, price: 140, alts: [
      { name: 'Chole with Jeera Rice', kcal: 520, protein: 18, carbs: 76, price: 140 },
      { name: 'Mixed Vegetable Khichdi with Ghee', kcal: 460, protein: 16, carbs: 66, price: 130 },
      { name: 'Dal Tadka with Brown Rice', kcal: 500, protein: 20, carbs: 68, price: 140 },
    ]},
    { label: 'Snack', name: 'Banana with Peanut Butter', kcal: 180, protein: 6, carbs: 28, price: 70, alts: [
      { name: 'Dates and Almonds', kcal: 160, protein: 4, carbs: 24, price: 80 },
      { name: 'Multigrain Khakhra with Hummus', kcal: 150, protein: 6, carbs: 20, price: 100 },
      { name: 'Roasted Chana Chaat', kcal: 140, protein: 8, carbs: 22, price: 80 },
    ]},
    { label: 'Dinner', name: 'Paneer and Vegetable Stir Fry with Quinoa', kcal: 420, protein: 24, carbs: 36, price: 170, alts: [
      { name: 'Methi Thepla with Curd', kcal: 380, protein: 14, carbs: 52, price: 120 },
      { name: 'Baingan Bharta with Roti', kcal: 360, protein: 12, carbs: 48, price: 130 },
      { name: 'Dal Khichdi with Ghee', kcal: 400, protein: 16, carbs: 60, price: 120 },
    ]},
  ],
  consistency: [
    { label: 'Breakfast', name: 'Ragi Idlis with Sambar', kcal: 300, protein: 12, carbs: 52, price: 100, alts: [
      { name: 'Besan Chilla with Chutney', kcal: 320, protein: 14, carbs: 36, price: 100 },
      { name: 'Quinoa Upma with Paneer Cubes', kcal: 340, protein: 16, carbs: 44, price: 130 },
      { name: 'Moong Dal Chilla with Paneer', kcal: 280, protein: 18, carbs: 28, price: 110 },
    ]},
    { label: 'Lunch', name: 'Dal Tadka with Brown Rice and Salad', kcal: 520, protein: 20, carbs: 68, price: 140, alts: [
      { name: 'Palak Paneer with 2 Rotis', kcal: 480, protein: 22, carbs: 44, price: 150 },
      { name: 'Chole with Jeera Rice', kcal: 500, protein: 18, carbs: 72, price: 140 },
      { name: 'Rajma Chawal with Pickled Onions', kcal: 540, protein: 20, carbs: 74, price: 140 },
    ]},
    { label: 'Snack', name: 'Makhana with Ghee and Rock Salt', kcal: 150, protein: 5, carbs: 18, price: 80, alts: [
      { name: 'Roasted Chana Chaat', kcal: 140, protein: 8, carbs: 22, price: 80 },
      { name: 'Sprouted Moong Chaat', kcal: 130, protein: 10, carbs: 18, price: 80 },
      { name: 'Banana with Peanut Butter', kcal: 180, protein: 6, carbs: 28, price: 70 },
    ]},
    { label: 'Dinner', name: 'Roti with Sabzi and Curd', kcal: 440, protein: 16, carbs: 58, price: 130, alts: [
      { name: 'Dal Khichdi with Ghee', kcal: 400, protein: 14, carbs: 60, price: 120 },
      { name: 'Moong Dal Soup with Roti', kcal: 360, protein: 16, carbs: 42, price: 120 },
      { name: 'Methi Thepla with Curd', kcal: 380, protein: 12, carbs: 52, price: 120 },
    ]},
  ],
}

const MEAL_ICONS = ['☀️', '🌿', '🍵', '🌙']

function getMealTiming(wakeTime: string, mealIndex: number) {
  if (!wakeTime) return { orderBy: '—', delivery: '—' }
  const [timePart, period] = wakeTime.includes(' ') ? wakeTime.split(' ') : [wakeTime, '']
  const [h, m] = timePart.split(':').map(Number)
  let hours = h
  if (period === 'PM' && h !== 12) hours = h + 12
  if (period === 'AM' && h === 12) hours = 0
  const wakeMinutes = hours * 60 + (m || 0)
  const offsets = [
    { orderBy: 0, delivery: 30 },
    { orderBy: 210, delivery: 240 },
    { orderBy: 390, delivery: 420 },
    { orderBy: 690, delivery: 720 },
  ]
  const fmt = (mins: number) => {
    const total = (wakeMinutes + mins) % (24 * 60)
    const hh = Math.floor(total / 60)
    const mm = total % 60
    const ap = hh >= 12 ? 'PM' : 'AM'
    const h12 = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh
    return `${h12}:${mm.toString().padStart(2, '0')} ${ap}`
  }
  return {
    orderBy: fmt(offsets[mealIndex].orderBy),
    delivery: fmt(offsets[mealIndex].delivery),
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [meals, setMeals] = useState<any[]>([])
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [swapIndex, setSwapIndex] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      const goal = data?.goal || 'consistency'
      setMeals(MEAL_DB[goal] || MEAL_DB.consistency)
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

  const firstName = profile?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const selectedMeals = meals.filter((_, i) => selected[i])
  const totalKcal = selectedMeals.reduce((s, m) => s + m.kcal, 0)
  const totalProtein = selectedMeals.reduce((s, m) => s + m.protein, 0)
  const totalCarbs = selectedMeals.reduce((s, m) => s + m.carbs, 0)
  const totalPrice = selectedMeals.reduce((s, m) => s + m.price, 0)
  const dayKcal = meals.reduce((s, m) => s + m.kcal, 0)
  const kcalPercent = dayKcal > 0 ? Math.round((totalKcal / dayKcal) * 100) : 0
  const circumference = 2 * Math.PI * 36
  const strokeDash = (kcalPercent / 100) * circumference

  const swapMeal = (mealIndex: number, alt: any) => {
    const updated = [...meals]
    updated[mealIndex] = { ...updated[mealIndex], ...alt }
    setMeals(updated)
    setSwapIndex(null)
  }

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white pb-28">

      <div className="px-5 pt-10 pb-4 max-w-md mx-auto">
        <p className="text-[#7a6f65] text-xs tracking-widest uppercase mb-1">{greeting}</p>
        <h1 className="text-3xl font-bold text-[#f0ebe4]">{firstName} 👋</h1>
      </div>

      {/* Nutrition ring */}
      <div className="px-5 max-w-md mx-auto mb-6">
        <div className="bg-[#161310] border border-[#252118] rounded-2xl p-5 flex items-center gap-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#252118" strokeWidth="5" />
              <circle cx="40" cy="40" r="36" fill="none" stroke="#c8714a" strokeWidth="5"
                strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round"
                className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-[#f0ebe4]">{kcalPercent}%</span>
              <span className="text-[10px] text-[#7a6f65]">selected</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-[#5a5248] uppercase tracking-widest mb-3">Today's nutrition</p>
            <div className="space-y-2">
              {[
                { label: 'Calories', val: `${totalKcal} / ${dayKcal}`, pct: kcalPercent, color: '#c8714a' },
                { label: 'Protein', val: `${totalProtein}g`, pct: Math.min((totalProtein / 60) * 100, 100), color: '#7a9e72' },
                { label: 'Carbs', val: `${totalCarbs}g`, pct: Math.min((totalCarbs / 150) * 100, 100), color: '#7a8fbe' },
              ].map(({ label, val, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#9a8f82]">{label}</span>
                    <span className="text-[#c8bfb5]">{val}</span>
                  </div>
                  <div className="h-1 bg-[#252118] rounded-full">
                    <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="px-5 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-[#5a5248] uppercase tracking-widest">Today's curated meals</p>
          {selectedMeals.length > 0 && (
            <p className="text-xs text-[#c8714a]">{selectedMeals.length} selected · ₹{totalPrice}</p>
          )}
        </div>

        <div className="space-y-3">
          {meals.map((meal, i) => {
            const timing = getMealTiming(profile?.wake_time || '07:00 AM', i)
            const isSelected = selected[i]
            const isSwapping = swapIndex === i
            return (
              <div key={i}>
                <div
                  onClick={() => { if (!isSwapping) setSelected(prev => ({ ...prev, [i]: !prev[i] })) }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isSelected ? 'border-[#c8714a] bg-[#1e1410]' : 'border-[#252118] bg-[#161310]'
                  }`}
                >
                  <div className="h-0.5 w-full transition-all duration-300" style={{ background: isSelected ? '#c8714a' : '#252118' }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm">{MEAL_ICONS[i]}</span>
                          <span className="text-[10px] text-[#5a5248] uppercase tracking-widest">{meal.label}</span>
                          {isSelected && <span className="text-[10px] text-[#c8714a] font-medium">✓ Selected</span>}
                        </div>
                        <p className="text-sm font-semibold text-[#e8e0d5] leading-snug mb-2">{meal.name}</p>
                        <div className="flex gap-3 mb-2">
                          <span className="text-[10px] text-[#7a6f65]">{meal.kcal} kcal</span>
                          <span className="text-[10px] text-[#7a6f65]">{meal.protein}g protein</span>
                          <span className="text-[10px] text-[#7a6f65]">{meal.carbs}g carbs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-[#3a3028]">⏰</span>
                          <span className="text-[9px] text-[#3a3028]">Order by {timing.orderBy} · Delivered by {timing.delivery}</span>
                        </div>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="text-sm font-semibold text-[#c8bfb5]">₹{meal.price}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSwapIndex(isSwapping ? null : i) }}
                          className={`mt-2 text-[10px] border rounded-full px-3 py-1 transition-all ${
                            isSwapping ? 'border-[#c8714a] text-[#c8714a]' : 'text-[#5a5248] border-[#2a2520] hover:border-[#5a5248] hover:text-[#9a8f82]'
                          }`}
                        >
                          {isSwapping ? 'Close' : 'Swap'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isSwapping && (
                  <div className="mt-2 bg-[#161310] border border-[#2a2520] rounded-2xl p-4">
                    <p className="text-[10px] text-[#5a5248] uppercase tracking-widest mb-3">Choose an alternative</p>
                    <div className="space-y-2">
                      {meal.alts.map((alt: any, j: number) => (
                        <button
                          key={j}
                          onClick={() => swapMeal(i, alt)}
                          className="w-full text-left px-3 py-3 rounded-xl border border-[#252118] hover:border-[#c8714a] transition-all group"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-[#c8bfb5] group-hover:text-[#f0ebe4] transition-all">{alt.name}</span>
                            <span className="text-xs text-[#5a5248] ml-2 flex-shrink-0">₹{alt.price}</span>
                          </div>
                          <div className="flex gap-3 mt-1">
                            <span className="text-[9px] text-[#5a5248]">{alt.kcal} kcal</span>
                            <span className="text-[9px] text-[#5a5248]">{alt.protein}g protein</span>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => { setSwapIndex(null); router.push('/menu') }}
                        className="w-full text-left px-3 py-3 rounded-xl border border-dashed border-[#2a2520] hover:border-[#5a5248] transition-all"
                      >
                        <span className="text-sm text-[#5a5248]">Browse full menu →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6">
          {selectedMeals.length > 0 ? (
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full bg-[#c8714a] text-white rounded-2xl py-4 font-semibold text-sm hover:bg-[#b5623d] transition-all"
            >
              Order {selectedMeals.length} meal{selectedMeals.length > 1 ? 's' : ''} · ₹{totalPrice}
            </button>
          ) : (
            <button disabled className="w-full bg-[#1c1916] text-[#5a5248] rounded-2xl py-4 font-semibold text-sm border border-[#252118] cursor-default">
              Tap a meal to select it
            </button>
          )}
        </div>

        <div className="mt-4 mb-6 px-4 py-3 rounded-xl bg-[#161310] border border-[#252118]">
          <p className="text-[10px] text-[#5a5248] leading-relaxed">
            Curated for your <span className="text-[#9a8f82]">{(profile?.goal || 'consistency').replace('_', ' ')}</span> goal · Wake time <span className="text-[#9a8f82]">{profile?.wake_time || '—'}</span>
          </p>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-[#161310] border border-[#252118] rounded-t-3xl p-6 pb-10">
            <div className="w-10 h-1 bg-[#3a3028] rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-bold text-[#f0ebe4] mb-1">Confirm your order?</h2>
            <p className="text-sm text-[#7a6f65] mb-6">{selectedMeals.length} meal{selectedMeals.length > 1 ? 's' : ''} · ₹{totalPrice} total</p>
            <div className="space-y-3 mb-6">
              {meals.filter((_, i) => selected[i]).map((m, i) => {
                const timing = getMealTiming(profile?.wake_time || '07:00 AM', i)
                return (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#9a8f82]">{m.label} — {m.name}</p>
                      <p className="text-[10px] text-[#3a3028] mt-0.5">Delivered by {timing.delivery}</p>
                    </div>
                    <span className="text-sm text-[#c8bfb5] ml-2">₹{m.price}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-2xl border border-[#2a2520] py-4 text-[#7a6f65] text-sm hover:border-[#5a5248] transition-all"
              >
                No, go back
              </button>
              <button
                onClick={() => { setConfirmOpen(false); router.push('/orders?checkout=true') }}
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
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { getTheme, light, dark, type Theme } from '@/lib/theme'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Diet tags on every meal:
// 'veg' = vegetarian (no meat, no egg, no fish)
// 'egg' = contains egg
// 'fish' = contains fish/seafood
// 'meat' = contains chicken/mutton/red meat
// 'dairy' = contains dairy (for vegan filtering)

const MEAL_DB: Record<string, any[]> = {
  muscle: [
    { label: 'Breakfast', name: 'Paneer Paratha with Curd', kcal: 520, protein: 24, carbs: 48, price: 130, tags: ['veg', 'dairy'],
      alts: [
        { name: 'Quinoa Upma with Paneer Cubes', kcal: 480, protein: 22, carbs: 52, price: 140, tags: ['veg', 'dairy'] },
        { name: 'Moong Dal Chilla with Paneer', kcal: 460, protein: 26, carbs: 44, price: 120, tags: ['veg', 'dairy'] },
        { name: 'Egg Bhurji on Whole Wheat Toast', kcal: 440, protein: 28, carbs: 38, price: 120, tags: ['egg'] },
        { name: 'Masala Omelette with Multigrain Bread', kcal: 400, protein: 26, carbs: 34, price: 110, tags: ['egg'] },
        { name: 'Grilled Salmon with Rye Toast', kcal: 460, protein: 34, carbs: 28, price: 180, tags: ['fish'] },
        { name: 'Chicken Keema Paratha', kcal: 520, protein: 32, carbs: 44, price: 150, tags: ['meat'] },
      ]},
    { label: 'Lunch', name: 'Chicken Dal with Brown Rice', kcal: 680, protein: 42, carbs: 62, price: 180, tags: ['meat'],
      alts: [
        { name: 'Dal Tadka with Brown Rice and Salad', kcal: 520, protein: 20, carbs: 68, price: 140, tags: ['veg'] },
        { name: 'Soya Keema with Roti and Raita', kcal: 560, protein: 34, carbs: 44, price: 150, tags: ['veg', 'dairy'] },
        { name: 'Grilled Chicken with Dal and Salad', kcal: 620, protein: 46, carbs: 40, price: 190, tags: ['meat'] },
        { name: 'Chicken Pulao with Raita', kcal: 660, protein: 38, carbs: 70, price: 170, tags: ['meat', 'dairy'] },
        { name: 'Fish Curry with Brown Rice', kcal: 580, protein: 40, carbs: 56, price: 190, tags: ['fish'] },
        { name: 'Grilled Fish with Dal and Salad', kcal: 560, protein: 42, carbs: 38, price: 195, tags: ['fish'] },
      ]},
    { label: 'Snack', name: 'Chicken Tikka Skewers', kcal: 220, protein: 28, carbs: 6, price: 120, tags: ['meat'],
      alts: [
        { name: 'Paneer Tikka Skewers', kcal: 200, protein: 20, carbs: 8, price: 110, tags: ['veg', 'dairy'] },
        { name: 'Boiled Egg with Chaat Masala', kcal: 160, protein: 18, carbs: 4, price: 70, tags: ['egg'] },
        { name: 'Tuna on Multigrain Crackers', kcal: 180, protein: 22, carbs: 12, price: 130, tags: ['fish'] },
        { name: 'Roasted Chana Chaat', kcal: 140, protein: 8, carbs: 22, price: 80, tags: ['veg'] },
      ]},
    { label: 'Dinner', name: 'Grilled Fish with Stir-Fried Vegetables', kcal: 480, protein: 38, carbs: 22, price: 200, tags: ['fish'],
      alts: [
        { name: 'Paneer and Vegetable Stir Fry with Quinoa', kcal: 420, protein: 24, carbs: 36, price: 170, tags: ['veg', 'dairy'] },
        { name: 'Egg and Spinach Curry with Roti', kcal: 440, protein: 30, carbs: 42, price: 160, tags: ['egg'] },
        { name: 'Chicken Stew with Brown Rice', kcal: 520, protein: 40, carbs: 48, price: 190, tags: ['meat'] },
        { name: 'Fish Curry with Brown Rice', kcal: 500, protein: 38, carbs: 52, price: 190, tags: ['fish'] },
        { name: 'Mutton Seekh Kebab with Salad', kcal: 500, protein: 42, carbs: 14, price: 230, tags: ['meat'] },
      ]},
  ],
  weight_loss: [
    { label: 'Breakfast', name: 'Moong Dal Chilla with Paneer', kcal: 280, protein: 18, carbs: 28, price: 110, tags: ['veg', 'dairy'],
      alts: [
        { name: 'Ragi Idlis with Sambar', kcal: 260, protein: 12, carbs: 48, price: 100, tags: ['veg'] },
        { name: 'Sprouted Moong Salad with Peanuts', kcal: 220, protein: 14, carbs: 24, price: 110, tags: ['veg'] },
        { name: 'Besan Chilla with Chutney', kcal: 300, protein: 14, carbs: 34, price: 100, tags: ['veg'] },
        { name: 'Egg White Omelette with Veggies', kcal: 200, protein: 20, carbs: 8, price: 100, tags: ['egg'] },
        { name: 'Grilled Fish with Sprout Salad', kcal: 260, protein: 28, carbs: 12, price: 160, tags: ['fish'] },
        { name: 'Boiled Egg Chaat with Chutney', kcal: 200, protein: 16, carbs: 10, price: 90, tags: ['egg'] },
      ]},
    { label: 'Lunch', name: 'Palak Paneer with 2 Rotis', kcal: 380, protein: 20, carbs: 42, price: 150, tags: ['veg', 'dairy'],
      alts: [
        { name: 'Dal Tadka with Brown Rice', kcal: 420, protein: 18, carbs: 62, price: 140, tags: ['veg'] },
        { name: 'Mixed Vegetable Khichdi with Ghee', kcal: 360, protein: 14, carbs: 58, price: 130, tags: ['veg', 'dairy'] },
        { name: 'Soya Keema with Roti and Raita', kcal: 400, protein: 26, carbs: 44, price: 150, tags: ['veg', 'dairy'] },
        { name: 'Grilled Fish with Stir-Fried Vegetables', kcal: 360, protein: 34, carbs: 18, price: 190, tags: ['fish'] },
        { name: 'Fish Soup with Multigrain Bread', kcal: 320, protein: 28, carbs: 24, price: 170, tags: ['fish'] },
        { name: 'Grilled Chicken Salad', kcal: 340, protein: 36, carbs: 14, price: 180, tags: ['meat'] },
      ]},
    { label: 'Snack', name: 'Roasted Chana Chaat', kcal: 140, protein: 8, carbs: 22, price: 80, tags: ['veg'],
      alts: [
        { name: 'Makhana with Ghee and Rock Salt', kcal: 120, protein: 4, carbs: 16, price: 90, tags: ['veg'] },
        { name: 'Sprouted Moong Chaat', kcal: 130, protein: 10, carbs: 18, price: 80, tags: ['veg'] },
        { name: 'Multigrain Khakhra with Hummus', kcal: 150, protein: 6, carbs: 20, price: 100, tags: ['veg'] },
        { name: 'Boiled Egg with Chaat Masala', kcal: 140, protein: 12, carbs: 4, price: 70, tags: ['egg'] },
        { name: 'Tuna on Multigrain Crackers', kcal: 160, protein: 18, carbs: 12, price: 120, tags: ['fish'] },
      ]},
    { label: 'Dinner', name: 'Moong Dal Soup with Roti', kcal: 300, protein: 16, carbs: 38, price: 120, tags: ['veg'],
      alts: [
        { name: 'Palak Soup with Whole Wheat Toast', kcal: 260, protein: 12, carbs: 30, price: 110, tags: ['veg'] },
        { name: 'Dal Khichdi with Ghee', kcal: 340, protein: 14, carbs: 52, price: 120, tags: ['veg', 'dairy'] },
        { name: 'Baingan Bharta with Roti', kcal: 320, protein: 10, carbs: 46, price: 130, tags: ['veg'] },
        { name: 'Grilled Fish with Stir-Fried Vegetables', kcal: 340, protein: 32, carbs: 16, price: 190, tags: ['fish'] },
        { name: 'Chicken Shorba with Toast', kcal: 300, protein: 28, carbs: 18, price: 160, tags: ['meat'] },
      ]},
  ],
  energy: [
    { label: 'Breakfast', name: 'Besan Chilla with Chutney', kcal: 340, protein: 16, carbs: 38, price: 100, tags: ['veg'],
      alts: [
        { name: 'Paneer Bhurji on Whole Wheat Toast', kcal: 360, protein: 20, carbs: 34, price: 120, tags: ['veg', 'dairy'] },
        { name: 'Tandoori Paneer Sandwich', kcal: 380, protein: 18, carbs: 42, price: 130, tags: ['veg', 'dairy'] },
        { name: 'Quinoa Upma with Paneer Cubes', kcal: 320, protein: 16, carbs: 44, price: 130, tags: ['veg', 'dairy'] },
        { name: 'Masala Omelette with Multigrain Bread', kcal: 360, protein: 22, carbs: 32, price: 110, tags: ['egg'] },
        { name: 'Smoked Fish Sandwich on Multigrain', kcal: 380, protein: 26, carbs: 36, price: 160, tags: ['fish'] },
        { name: 'Egg Bhurji on Whole Wheat Toast', kcal: 380, protein: 24, carbs: 34, price: 110, tags: ['egg'] },
      ]},
    { label: 'Lunch', name: 'Rajma Chawal with Pickled Onions', kcal: 540, protein: 22, carbs: 72, price: 140, tags: ['veg'],
      alts: [
        { name: 'Chole with Jeera Rice', kcal: 520, protein: 18, carbs: 76, price: 140, tags: ['veg'] },
        { name: 'Mixed Vegetable Khichdi with Ghee', kcal: 460, protein: 16, carbs: 66, price: 130, tags: ['veg', 'dairy'] },
        { name: 'Dal Tadka with Brown Rice', kcal: 500, protein: 20, carbs: 68, price: 140, tags: ['veg'] },
        { name: 'Fish Curry with Brown Rice', kcal: 540, protein: 36, carbs: 58, price: 190, tags: ['fish'] },
        { name: 'Chicken Pulao with Raita', kcal: 560, protein: 34, carbs: 64, price: 170, tags: ['meat', 'dairy'] },
      ]},
    { label: 'Snack', name: 'Banana with Peanut Butter', kcal: 180, protein: 6, carbs: 28, price: 70, tags: ['veg'],
      alts: [
        { name: 'Dates and Almonds', kcal: 160, protein: 4, carbs: 24, price: 80, tags: ['veg'] },
        { name: 'Multigrain Khakhra with Hummus', kcal: 150, protein: 6, carbs: 20, price: 100, tags: ['veg'] },
        { name: 'Roasted Chana Chaat', kcal: 140, protein: 8, carbs: 22, price: 80, tags: ['veg'] },
        { name: 'Boiled Egg with Chaat Masala', kcal: 140, protein: 12, carbs: 4, price: 70, tags: ['egg'] },
        { name: 'Tuna on Multigrain Crackers', kcal: 160, protein: 18, carbs: 12, price: 120, tags: ['fish'] },
      ]},
    { label: 'Dinner', name: 'Paneer and Vegetable Stir Fry with Quinoa', kcal: 420, protein: 24, carbs: 36, price: 170, tags: ['veg', 'dairy'],
      alts: [
        { name: 'Methi Thepla with Curd', kcal: 380, protein: 14, carbs: 52, price: 120, tags: ['veg', 'dairy'] },
        { name: 'Baingan Bharta with Roti', kcal: 360, protein: 12, carbs: 48, price: 130, tags: ['veg'] },
        { name: 'Dal Khichdi with Ghee', kcal: 400, protein: 16, carbs: 60, price: 120, tags: ['veg', 'dairy'] },
        { name: 'Grilled Fish with Stir-Fried Vegetables', kcal: 400, protein: 34, carbs: 20, price: 190, tags: ['fish'] },
        { name: 'Chicken Stew with Brown Rice', kcal: 460, protein: 36, carbs: 44, price: 190, tags: ['meat'] },
      ]},
  ],
  consistency: [
    { label: 'Breakfast', name: 'Ragi Idlis with Sambar', kcal: 300, protein: 12, carbs: 52, price: 100, tags: ['veg'],
      alts: [
        { name: 'Besan Chilla with Chutney', kcal: 320, protein: 14, carbs: 36, price: 100, tags: ['veg'] },
        { name: 'Quinoa Upma with Paneer Cubes', kcal: 340, protein: 16, carbs: 44, price: 130, tags: ['veg', 'dairy'] },
        { name: 'Moong Dal Chilla with Paneer', kcal: 280, protein: 18, carbs: 28, price: 110, tags: ['veg', 'dairy'] },
        { name: 'Masala Omelette with Multigrain Bread', kcal: 340, protein: 20, carbs: 30, price: 110, tags: ['egg'] },
        { name: 'Boiled Egg Chaat with Chutney', kcal: 220, protein: 14, carbs: 12, price: 90, tags: ['egg'] },
        { name: 'Grilled Fish with Sprout Salad', kcal: 280, protein: 28, carbs: 14, price: 160, tags: ['fish'] },
      ]},
    { label: 'Lunch', name: 'Dal Tadka with Brown Rice and Salad', kcal: 520, protein: 20, carbs: 68, price: 140, tags: ['veg'],
      alts: [
        { name: 'Palak Paneer with 2 Rotis', kcal: 480, protein: 22, carbs: 44, price: 150, tags: ['veg', 'dairy'] },
        { name: 'Chole with Jeera Rice', kcal: 500, protein: 18, carbs: 72, price: 140, tags: ['veg'] },
        { name: 'Rajma Chawal with Pickled Onions', kcal: 540, protein: 20, carbs: 74, price: 140, tags: ['veg'] },
        { name: 'Fish Curry with Brown Rice', kcal: 520, protein: 36, carbs: 54, price: 190, tags: ['fish'] },
        { name: 'Grilled Fish with Dal and Salad', kcal: 500, protein: 38, carbs: 36, price: 195, tags: ['fish'] },
        { name: 'Chicken Dal with Brown Rice', kcal: 580, protein: 38, carbs: 58, price: 180, tags: ['meat'] },
      ]},
    { label: 'Snack', name: 'Makhana with Ghee and Rock Salt', kcal: 150, protein: 5, carbs: 18, price: 80, tags: ['veg', 'dairy'],
      alts: [
        { name: 'Roasted Chana Chaat', kcal: 140, protein: 8, carbs: 22, price: 80, tags: ['veg'] },
        { name: 'Sprouted Moong Chaat', kcal: 130, protein: 10, carbs: 18, price: 80, tags: ['veg'] },
        { name: 'Banana with Peanut Butter', kcal: 180, protein: 6, carbs: 28, price: 70, tags: ['veg'] },
        { name: 'Boiled Egg with Chaat Masala', kcal: 140, protein: 12, carbs: 4, price: 70, tags: ['egg'] },
        { name: 'Tuna on Multigrain Crackers', kcal: 160, protein: 18, carbs: 12, price: 120, tags: ['fish'] },
      ]},
    { label: 'Dinner', name: 'Roti with Sabzi and Curd', kcal: 440, protein: 16, carbs: 58, price: 130, tags: ['veg', 'dairy'],
      alts: [
        { name: 'Dal Khichdi with Ghee', kcal: 400, protein: 14, carbs: 60, price: 120, tags: ['veg', 'dairy'] },
        { name: 'Moong Dal Soup with Roti', kcal: 360, protein: 16, carbs: 42, price: 120, tags: ['veg'] },
        { name: 'Methi Thepla with Curd', kcal: 380, protein: 12, carbs: 52, price: 120, tags: ['veg', 'dairy'] },
        { name: 'Grilled Fish with Stir-Fried Vegetables', kcal: 380, protein: 32, carbs: 18, price: 190, tags: ['fish'] },
        { name: 'Egg and Spinach Curry with Roti', kcal: 380, protein: 24, carbs: 40, price: 150, tags: ['egg'] },
        { name: 'Chicken Shorba with Toast', kcal: 340, protein: 28, carbs: 20, price: 160, tags: ['meat'] },
      ]},
  ],
}

const MEAL_ICONS = ['☀️', '🌿', '🍵', '🌙']

// What tags each diet allows
function getAllowedTags(dietType: string): string[] {
  switch (dietType) {
    case 'vegan': return ['veg'] // no dairy either — handled separately
    case 'vegetarian': return ['veg', 'dairy']
    case 'jain-style': return ['veg', 'dairy']
    case 'eggetarian': return ['veg', 'dairy', 'egg']
    case 'pescatarian': return ['veg', 'dairy', 'egg', 'fish']
    case 'non-veg': return ['veg', 'dairy', 'egg', 'fish', 'meat']
    default: return ['veg', 'dairy', 'egg', 'fish', 'meat']
  }
}

function mealAllowed(mealTags: string[], allowedTags: string[]): boolean {
  // meal is allowed if ALL its tags are in the allowed list
  // (e.g. a 'meat' meal won't pass for pescatarian)
  return mealTags.every(tag => allowedTags.includes(tag))
}

function getFilteredMeal(meal: any, allowedTags: string[]): any {
  // If the default meal is allowed, return it
  if (mealAllowed(meal.tags, allowedTags)) return meal

  // Otherwise find the first allowed alternative
  const alt = meal.alts.find((a: any) => mealAllowed(a.tags, allowedTags))
  if (alt) return { ...meal, name: alt.name, kcal: alt.kcal, protein: alt.protein, carbs: alt.carbs, price: alt.price, tags: alt.tags }

  // Fallback — return original (shouldn't happen with complete data)
  return meal
}

function getMealTiming(wakeTime: string, mealIndex: number) {
  // Fixed delivery times
  const deliveryTimes = ['08:00 AM', '01:00 PM', '04:30 PM', '08:00 PM']
  const deliveryTime = deliveryTimes[mealIndex]

  // Breakfast delivery nudged 30 min after wake time if wake time is after 7:30 AM
  if (mealIndex === 0 && wakeTime) {
    const [timePart, period] = wakeTime.includes(' ') ? wakeTime.split(' ') : [wakeTime, 'AM']
    const [h, m] = timePart.split(':').map(Number)
    let hours = h
    if (period === 'PM' && h !== 12) hours = h + 12
    if (period === 'AM' && h === 12) hours = 0
    const wakeMinutes = hours * 60 + (m || 0)
    const deliveryMinutes = wakeMinutes + 30

    // Only override if wake time pushes breakfast later than 8 AM
    if (deliveryMinutes > 8 * 60) {
      const hh = Math.floor(deliveryMinutes / 60) % 24
      const mm = deliveryMinutes % 60
      const ap = hh >= 12 ? 'PM' : 'AM'
      const h12 = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh
      const delivery = `${h12}:${mm.toString().padStart(2, '0')} ${ap}`
      const orderHh = hh - (mm >= 30 ? 0 : 1)
      const orderMm = mm >= 30 ? mm - 30 : mm + 30
      const orderAp = orderHh >= 12 ? 'PM' : 'AM'
      const orderH12 = orderHh > 12 ? orderHh - 12 : orderHh === 0 ? 12 : orderHh
      return {
        orderBy: `${orderH12}:${orderMm.toString().padStart(2, '0')} ${orderAp}`,
        delivery,
      }
    }
  }

  // Calculate order-by as 30 min before delivery
  const [timePart, period] = deliveryTime.split(' ')
  const [h, m] = timePart.split(':').map(Number)
  let hours = h
  if (period === 'PM' && h !== 12) hours = h + 12
  if (period === 'AM' && h === 12) hours = 0
  const deliveryMinutes = hours * 60 + m
  const orderMinutes = deliveryMinutes - 30
  const ohh = Math.floor(orderMinutes / 60)
  const omm = orderMinutes % 60
  const oap = ohh >= 12 ? 'PM' : 'AM'
  const oh12 = ohh > 12 ? ohh - 12 : ohh === 0 ? 12 : ohh

  return {
    orderBy: `${oh12}:${omm.toString().padStart(2, '0')} ${oap}`,
    delivery: deliveryTime,
  }
}

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
              <span className="text-[10px] transition-all" style={{ color: isActive ? t.accent : t.textTertiary, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full" style={{ background: t.accent }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [meals, setMeals] = useState<any[]>([])
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [swapIndex, setSwapIndex] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [t, setT] = useState<Theme>(light)

  useEffect(() => {
    setT(getTheme() === 'dark' ? dark : light)
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)

      const goal = data?.goal || 'consistency'
      const dietType = data?.diet_type || 'non-veg'
      const allowedTags = getAllowedTags(dietType)
      const rawMeals = MEAL_DB[goal] || MEAL_DB.consistency

      // Filter each meal slot for the user's diet
      const filteredMeals = rawMeals.map(meal => ({
        ...getFilteredMeal(meal, allowedTags),
        alts: meal.alts.filter((a: any) => mealAllowed(a.tags, allowedTags)),
      }))

      setMeals(filteredMeals)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: t.bg }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: t.accent, borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: t.textSecondary }}>Curating your plan...</p>
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
    <div className="min-h-screen pb-28 transition-colors duration-300" style={{ background: t.bg }}>

      <div className="px-5 pt-10 pb-4 max-w-md mx-auto">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: t.textSecondary }}>{greeting}</p>
        <h1 className="text-3xl font-bold" style={{ color: t.textPrimary }}>{firstName} 👋</h1>
      </div>

      {/* Nutrition ring */}
      <div className="px-5 max-w-md mx-auto mb-6">
        <div className="rounded-2xl p-5 flex items-center gap-5 border" style={{ background: t.surface, borderColor: t.border }}>
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
              <circle cx="40" cy="40" r="36" fill="none" stroke={t.border} strokeWidth="5" />
              <circle cx="40" cy="40" r="36" fill="none" stroke={t.accent} strokeWidth="5"
                strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round"
                className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold" style={{ color: t.textPrimary }}>{kcalPercent}%</span>
              <span className="text-[10px]" style={{ color: t.textSecondary }}>selected</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: t.textTertiary }}>Today's nutrition</p>
            <div className="space-y-2">
              {[
                { label: 'Calories', val: `${totalKcal} / ${dayKcal}`, pct: kcalPercent, color: t.accent },
                { label: 'Protein', val: `${totalProtein}g`, pct: Math.min((totalProtein / 60) * 100, 100), color: t.sage },
                { label: 'Carbs', val: `${totalCarbs}g`, pct: Math.min((totalCarbs / 150) * 100, 100), color: '#7A8FBE' },
              ].map(({ label, val, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: t.textSecondary }}>{label}</span>
                    <span style={{ color: t.textPrimary }}>{val}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: t.border }}>
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
          <p className="text-[10px] uppercase tracking-widest" style={{ color: t.textTertiary }}>Today's curated meals</p>
          {selectedMeals.length > 0 && (
            <p className="text-xs font-medium" style={{ color: t.accent }}>{selectedMeals.length} selected · ₹{totalPrice}</p>
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
                  className="rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer"
                  style={{
                    background: isSelected ? (t === light ? '#FFF5EE' : '#1E1410') : t.surface,
                    borderColor: isSelected ? t.accent : t.border,
                  }}
                >
                  <div className="h-0.5 w-full transition-all duration-300" style={{ background: isSelected ? t.accent : t.border }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm">{MEAL_ICONS[i]}</span>
                          <span className="text-[10px] uppercase tracking-widest" style={{ color: t.textTertiary }}>{meal.label}</span>
                          {isSelected && <span className="text-[10px] font-semibold" style={{ color: t.accent }}>✓ Selected</span>}
                        </div>
                        <p className="text-sm font-semibold leading-snug mb-2" style={{ color: t.textPrimary }}>{meal.name}</p>
                        <div className="flex gap-3 mb-2">
                          <span className="text-[10px]" style={{ color: t.textSecondary }}>{meal.kcal} kcal</span>
                          <span className="text-[10px]" style={{ color: t.textSecondary }}>{meal.protein}g protein</span>
                          <span className="text-[10px]" style={{ color: t.textSecondary }}>{meal.carbs}g carbs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px]" style={{ color: t.textTertiary }}>⏰</span>
                          <span className="text-[9px]" style={{ color: t.textTertiary }}>Order by {timing.orderBy} · Delivered by {timing.delivery}</span>
                        </div>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>₹{meal.price}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSwapIndex(isSwapping ? null : i) }}
                          className="mt-2 text-[10px] border rounded-full px-3 py-1 transition-all"
                          style={{ borderColor: isSwapping ? t.accent : t.border, color: isSwapping ? t.accent : t.textSecondary }}
                        >
                          {isSwapping ? 'Close' : 'Swap'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isSwapping && (
                  <div className="mt-2 rounded-2xl border p-4" style={{ background: t.surface, borderColor: t.border }}>
                    <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: t.textTertiary }}>Choose an alternative</p>
                    <div className="space-y-2">
                      {meal.alts.length > 0 ? meal.alts.map((alt: any, j: number) => (
                        <button
                          key={j}
                          onClick={() => swapMeal(i, alt)}
                          className="w-full text-left px-3 py-3 rounded-xl border transition-all"
                          style={{ borderColor: t.border }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = t.accent)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm" style={{ color: t.textPrimary }}>{alt.name}</span>
                            <span className="text-xs ml-2 flex-shrink-0" style={{ color: t.textSecondary }}>₹{alt.price}</span>
                          </div>
                          <div className="flex gap-3 mt-1">
                            <span className="text-[9px]" style={{ color: t.textTertiary }}>{alt.kcal} kcal</span>
                            <span className="text-[9px]" style={{ color: t.textTertiary }}>{alt.protein}g protein</span>
                          </div>
                        </button>
                      )) : (
                        <p className="text-sm text-center py-2" style={{ color: t.textTertiary }}>No alternatives available for your diet</p>
                      )}
                      <button
                        onClick={() => { setSwapIndex(null); router.push('/menu') }}
                        className="w-full text-left px-3 py-3 rounded-xl border border-dashed transition-all"
                        style={{ borderColor: t.border }}
                      >
                        <span className="text-sm" style={{ color: t.textSecondary }}>Browse full menu →</span>
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
              className="w-full rounded-2xl py-4 font-semibold text-sm transition-all"
              style={{ background: t.accent, color: t.accentText }}
            >
              Order {selectedMeals.length} meal{selectedMeals.length > 1 ? 's' : ''} · ₹{totalPrice}
            </button>
          ) : (
            <button disabled className="w-full rounded-2xl py-4 font-semibold text-sm border cursor-default" style={{ background: t.surface, color: t.textTertiary, borderColor: t.border }}>
              Tap a meal to select it
            </button>
          )}
        </div>

        <div className="mt-4 mb-6 px-4 py-3 rounded-xl border" style={{ background: t.surface, borderColor: t.border }}>
          <p className="text-[10px] leading-relaxed" style={{ color: t.textTertiary }}>
            Curated for your <span style={{ color: t.textSecondary }}>{(profile?.goal || 'consistency').replace('_', ' ')}</span> goal · {profile?.diet_type?.replace(/_/g, ' ')} · Wake time <span style={{ color: t.textSecondary }}>{profile?.wake_time || '—'}</span>
          </p>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-md rounded-t-3xl p-6 pb-10 border-t border-x" style={{ background: t.surface, borderColor: t.border }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: t.border }} />
            <h2 className="text-xl font-bold mb-1" style={{ color: t.textPrimary }}>Confirm your order?</h2>
            <p className="text-sm mb-6" style={{ color: t.textSecondary }}>{selectedMeals.length} meal{selectedMeals.length > 1 ? 's' : ''} · ₹{totalPrice} total</p>
            <div className="space-y-3 mb-6">
              {meals.filter((_, i) => selected[i]).map((m, i) => {
                const timing = getMealTiming(profile?.wake_time || '07:00 AM', i)
                return (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className="text-sm" style={{ color: t.textSecondary }}>{m.label} — {m.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: t.textTertiary }}>Delivered by {timing.delivery}</p>
                    </div>
                    <span className="text-sm ml-2" style={{ color: t.textPrimary }}>₹{m.price}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 rounded-2xl border py-4 text-sm transition-all" style={{ borderColor: t.border, color: t.textSecondary }}>
                No, go back
              </button>
              <button onClick={() => { setConfirmOpen(false); router.push('/orders?checkout=true') }} className="flex-1 rounded-2xl py-4 font-semibold text-sm transition-all" style={{ background: t.accent, color: t.accentText }}>
                Yes, place order
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav t={t} active="/dashboard" />
    </div>
  )
}
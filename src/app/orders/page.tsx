'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { getTheme, light, dark, type Theme } from '@/lib/theme'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const TRACKING_STEPS = [
  { key: 'confirmed', label: 'Order confirmed', icon: '✓', desc: 'We have your order' },
  { key: 'preparing', label: 'Preparing your meal', icon: '👨‍🍳', desc: 'Fresh, made to order' },
  { key: 'picked_up', label: 'Picked up', icon: '🛵', desc: 'On the way to you' },
  { key: 'arriving', label: 'Arriving soon', icon: '📍', desc: 'Almost there' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your meal' },
]

const PAST_ORDERS = [
  { id: 'ORD-2841', date: '29 May 2026', meals: ['Moong Dal Chilla with Paneer', 'Dal Tadka with Brown Rice'], total: 250, type: 'delivery' },
  { id: 'ORD-2798', date: '28 May 2026', meals: ['Ragi Idlis with Sambar', 'Palak Paneer with 2 Rotis', 'Roasted Chana Chaat'], total: 330, type: 'pickup' },
]

type DeliveryType = 'delivery' | 'pickup' | 'subscription' | null

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

export default function OrdersPage() {
  const router = useRouter()
  const [t, setT] = useState<Theme>(light)
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(null)
  const [address, setAddress] = useState('')
  const [kiosk, setKiosk] = useState('')
  const [subPlan, setSubPlan] = useState<'daily' | 'weekly' | 'monthly' | null>(null)
  const [trackingStep, setTrackingStep] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orderId] = useState(`ORD-${Math.floor(Math.random() * 1000) + 2900}`)

  useEffect(() => {
    setT(getTheme() === 'dark' ? dark : light)
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setLoading(false)
    }
    load()
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'true') setCheckoutOpen(true)
  }, [])

  useEffect(() => {
    if (!orderPlaced) return
    const interval = setInterval(() => {
      setTrackingStep(prev => {
        if (prev >= TRACKING_STEPS.length - 1) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [orderPlaced])

  const placeOrder = () => {
    if (!canPlaceOrder()) return
    setCheckoutOpen(false)
    setOrderPlaced(true)
    setActiveTab('active')
    setTrackingStep(0)
    setTimeout(() => setTrackingStep(1), 1500)
  }

  const canPlaceOrder = () => {
    if (!deliveryType) return false
    if (deliveryType === 'delivery') return address.trim().length > 0
    if (deliveryType === 'pickup') return kiosk.length > 0
    if (deliveryType === 'subscription') return subPlan !== null
    return false
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: t.bg }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: t.accent, borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="min-h-screen pb-28 transition-colors duration-300" style={{ background: t.bg }}>

      <div className="px-5 pt-10 pb-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold" style={{ color: t.textPrimary }}>Orders</h1>
        <p className="text-xs mt-1" style={{ color: t.textSecondary }}>Track meals, manage deliveries.</p>
      </div>

      <div className="px-5 max-w-md mx-auto mb-6">
        <div className="flex rounded-2xl p-1 border" style={{ background: t.surface, borderColor: t.border }}>
          {(['active', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all capitalize"
              style={{
                background: activeTab === tab ? t.accent : 'transparent',
                color: activeTab === tab ? t.accentText : t.textSecondary,
              }}
            >
              {tab === 'active' ? 'Active order' : 'Past orders'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 max-w-md mx-auto">

        {activeTab === 'active' && (
          !orderPlaced ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4" style={{ background: t.surface, borderColor: t.border }}>
                <span className="text-2xl">📦</span>
              </div>
              <p className="font-medium mb-2" style={{ color: t.textPrimary }}>No active order</p>
              <p className="text-sm mb-8" style={{ color: t.textSecondary }}>Select and confirm meals from the home screen to place an order.</p>
              <button onClick={() => router.push('/dashboard')} className="rounded-2xl px-6 py-3 text-sm font-medium transition-all" style={{ background: t.accent, color: t.accentText }}>
                Go to today's meals
              </button>
            </div>
          ) : (
            <div>
              <div className="rounded-2xl border p-5 mb-4" style={{ background: t.surface, borderColor: t.border }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: t.textTertiary }}>Order placed</p>
                    <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>{orderId}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full" style={{
                    background: trackingStep >= TRACKING_STEPS.length - 1 ? '#E8F5E8' : '#FFF0E8',
                    color: trackingStep >= TRACKING_STEPS.length - 1 ? t.sage : t.accent,
                  }}>
                    {trackingStep >= TRACKING_STEPS.length - 1 ? 'Delivered ✓' : 'In progress'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-5 pb-4 border-b" style={{ borderColor: t.border }}>
                  <span className="text-sm">{deliveryType === 'delivery' ? '🛵' : deliveryType === 'pickup' ? '🏪' : '📅'}</span>
                  <span className="text-xs" style={{ color: t.textSecondary }}>
                    {deliveryType === 'delivery' ? `Delivery to ${address}` :
                     deliveryType === 'pickup' ? `Pickup from ${kiosk}` :
                     `${subPlan} subscription active`}
                  </span>
                </div>

                <div className="space-y-4">
                  {TRACKING_STEPS.map((step, i) => {
                    const isDone = i < trackingStep
                    const isCurrent = i === trackingStep
                    const isPending = i > trackingStep
                    return (
                      <div key={step.key} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-500" style={{
                            background: isDone ? t.sage : isCurrent ? t.accent : t.border,
                            color: isDone || isCurrent ? '#fff' : t.textTertiary,
                          }}>
                            {isDone ? '✓' : step.icon}
                          </div>
                          {i < TRACKING_STEPS.length - 1 && (
                            <div className="w-0.5 h-6 mt-1 transition-all duration-700" style={{ background: isDone ? t.sage : t.border }} />
                          )}
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-medium" style={{ color: isPending ? t.textTertiary : isCurrent ? t.textPrimary : t.textSecondary }}>{step.label}</p>
                          {isCurrent && <p className="text-xs mt-0.5" style={{ color: t.textTertiary }}>{step.desc}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {trackingStep < TRACKING_STEPS.length - 1 && (
                <p className="text-center text-xs" style={{ color: t.textTertiary }}>Tracking updates automatically</p>
              )}
            </div>
          )
        )}

        {activeTab === 'past' && (
          <div className="space-y-3">
            {PAST_ORDERS.map((order) => (
              <div key={order.id} className="rounded-2xl border p-5" style={{ background: t.surface, borderColor: t.border }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: t.textTertiary }}>{order.date}</p>
                    <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>₹{order.total}</p>
                    <span className="text-xs" style={{ color: t.sage }}>Delivered ✓</span>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {order.meals.map((meal, i) => (
                    <p key={i} className="text-xs" style={{ color: t.textSecondary }}>· {meal}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: t.border }}>
                  <span className="text-xs" style={{ color: t.textTertiary }}>{order.type === 'delivery' ? '🛵 Delivery' : '🏪 Pickup'}</span>
                  <button onClick={() => { setDeliveryType(null); setAddress(''); setKiosk(''); setSubPlan(null); setCheckoutOpen(true) }} className="text-xs font-medium transition-all" style={{ color: t.accent }}>
                    Reorder →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout sheet */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-md rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto border-t border-x" style={{ background: t.surface, borderColor: t.border }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: t.border }} />
            <h2 className="text-xl font-bold mb-1" style={{ color: t.textPrimary }}>How would you like it?</h2>
            <p className="text-sm mb-6" style={{ color: t.textSecondary }}>Choose a delivery method to continue.</p>

            <div className="space-y-3 mb-6">
              {[
                { key: 'delivery', icon: '🛵', title: 'Home / Office delivery', desc: 'Delivered fresh to your door' },
                { key: 'pickup', icon: '🏪', title: 'Kiosk pickup', desc: 'Pick up from a KCAL kiosk near you' },
                { key: 'subscription', icon: '📅', title: 'Subscribe & save', desc: 'Daily, weekly, or monthly plan' },
              ].map((opt) => (
                <button key={opt.key} onClick={() => setDeliveryType(opt.key as DeliveryType)}
                  className="w-full text-left px-4 py-4 rounded-2xl border transition-all"
                  style={{ borderColor: deliveryType === opt.key ? t.accent : t.border, background: deliveryType === opt.key ? (t === light ? '#FFF5EE' : '#1E1410') : t.bg }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: t.textPrimary }}>{opt.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>{opt.desc}</p>
                    </div>
                    {deliveryType === opt.key && <span style={{ color: t.accent }}>✓</span>}
                  </div>
                </button>
              ))}
            </div>

            {deliveryType === 'delivery' && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: t.textTertiary }}>Delivery address</p>
                <textarea
                  className="w-full rounded-xl border px-4 py-3 text-sm resize-none transition-all focus:outline-none"
                  style={{ borderColor: t.border, background: t.inputBg, color: t.textPrimary }}
                  placeholder="Enter your full address..."
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            )}

            {deliveryType === 'pickup' && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: t.textTertiary }}>Choose a kiosk</p>
                <div className="space-y-2">
                  {['KCAL Kiosk — Andheri West', 'KCAL Kiosk — Bandra Kurla Complex', 'KCAL Kiosk — Powai Lake'].map((k) => (
                    <button key={k} onClick={() => setKiosk(k)}
                      className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
                      style={{ borderColor: kiosk === k ? t.accent : t.border, color: kiosk === k ? t.textPrimary : t.textSecondary, background: kiosk === k ? (t === light ? '#FFF5EE' : '#1E1410') : 'transparent' }}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {deliveryType === 'subscription' && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: t.textTertiary }}>Choose a plan</p>
                <div className="space-y-2">
                  {[
                    { key: 'daily', label: 'Daily', desc: 'Fresh plan every day', price: '₹250 / day' },
                    { key: 'weekly', label: 'Weekly', desc: '7 days, save 10%', price: '₹1,575 / week' },
                    { key: 'monthly', label: 'Monthly', desc: '30 days, save 20%', price: '₹6,000 / month' },
                  ].map((plan) => (
                    <button key={plan.key} onClick={() => setSubPlan(plan.key as any)}
                      className="w-full text-left px-4 py-3 rounded-xl border transition-all"
                      style={{ borderColor: subPlan === plan.key ? t.accent : t.border, background: subPlan === plan.key ? (t === light ? '#FFF5EE' : '#1E1410') : 'transparent' }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium" style={{ color: t.textPrimary }}>{plan.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>{plan.desc}</p>
                        </div>
                        <span className="text-sm" style={{ color: t.textPrimary }}>{plan.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setCheckoutOpen(false)} className="flex-1 rounded-2xl border py-4 text-sm transition-all" style={{ borderColor: t.border, color: t.textSecondary }}>
                Cancel
              </button>
              <button onClick={placeOrder} disabled={!canPlaceOrder()}
                className="flex-1 rounded-2xl py-4 font-semibold text-sm transition-all disabled:opacity-30"
                style={{ background: t.accent, color: t.accentText }}
              >
                Place order
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav t={t} active="/orders" />
    </div>
  )
}
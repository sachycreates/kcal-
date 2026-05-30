'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

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
  {
    id: 'ORD-2841',
    date: '29 May 2026',
    meals: ['Moong Dal Chilla with Paneer', 'Dal Tadka with Brown Rice'],
    total: 250,
    status: 'delivered',
    type: 'delivery',
  },
  {
    id: 'ORD-2798',
    date: '28 May 2026',
    meals: ['Ragi Idlis with Sambar', 'Palak Paneer with 2 Rotis', 'Roasted Chana Chaat'],
    total: 330,
    status: 'delivered',
    type: 'pickup',
  },
]

type DeliveryType = 'delivery' | 'pickup' | 'subscription' | null

export default function OrdersPage() {
  const router = useRouter()
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
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('checkout') === 'true') setCheckoutOpen(true)
    }
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
    <div className="flex min-h-screen items-center justify-center bg-[#0e0c0a]">
      <div className="w-8 h-8 border border-[#c8714a] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white pb-28">

      <div className="px-5 pt-10 pb-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-[#f0ebe4]">Orders</h1>
        <p className="text-[#7a6f65] text-xs mt-1">Track meals, manage deliveries.</p>
      </div>

      {/* Tabs */}
      <div className="px-5 max-w-md mx-auto mb-6">
        <div className="flex bg-[#161310] border border-[#252118] rounded-2xl p-1">
          {(['active', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab ? 'bg-[#c8714a] text-white' : 'text-[#5a5248] hover:text-[#9a8f82]'
              }`}
            >
              {tab === 'active' ? 'Active order' : 'Past orders'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 max-w-md mx-auto">

        {activeTab === 'active' && (
          <div>
            {!orderPlaced ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-[#161310] border border-[#252118] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <p className="text-[#c8bfb5] font-medium mb-2">No active order</p>
                <p className="text-[#5a5248] text-sm mb-8">Select and confirm meals from the home screen to place an order.</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#c8714a] text-white rounded-2xl px-6 py-3 text-sm font-medium hover:bg-[#b5623d] transition-all"
                >
                  Go to today's meals
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-[#161310] border border-[#252118] rounded-2xl p-5 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-[#5a5248] uppercase tracking-widest mb-1">Order placed</p>
                      <p className="text-sm font-semibold text-[#f0ebe4]">{orderId}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      trackingStep >= TRACKING_STEPS.length - 1
                        ? 'bg-[#1a2e1a] text-[#7a9e72]'
                        : 'bg-[#2e1e10] text-[#c8714a]'
                    }`}>
                      {trackingStep >= TRACKING_STEPS.length - 1 ? 'Delivered ✓' : 'In progress'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#252118]">
                    <span className="text-sm">
                      {deliveryType === 'delivery' ? '🛵' : deliveryType === 'pickup' ? '🏪' : '📅'}
                    </span>
                    <span className="text-xs text-[#9a8f82]">
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
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${
                              isDone ? 'bg-[#7a9e72] text-white' :
                              isCurrent ? 'bg-[#c8714a] text-white' :
                              'bg-[#252118] text-[#5a5248]'
                            }`}>
                              {isDone ? '✓' : step.icon}
                            </div>
                            {i < TRACKING_STEPS.length - 1 && (
                              <div className={`w-0.5 h-6 mt-1 transition-all duration-700 ${
                                isDone ? 'bg-[#7a9e72]' : 'bg-[#252118]'
                              }`} />
                            )}
                          </div>
                          <div className="pt-1">
                            <p className={`text-sm font-medium transition-all ${
                              isPending ? 'text-[#3a3028]' :
                              isCurrent ? 'text-[#f0ebe4]' :
                              'text-[#7a6f65]'
                            }`}>{step.label}</p>
                            {isCurrent && (
                              <p className="text-xs text-[#5a5248] mt-0.5">{step.desc}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                {trackingStep < TRACKING_STEPS.length - 1 && (
                  <p className="text-center text-xs text-[#3a3028]">Tracking updates automatically</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-3">
            {PAST_ORDERS.map((order) => (
              <div key={order.id} className="bg-[#161310] border border-[#252118] rounded-2xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-[#5a5248] mb-1">{order.date}</p>
                    <p className="text-sm font-semibold text-[#f0ebe4]">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#c8bfb5]">₹{order.total}</p>
                    <span className="text-xs text-[#7a9e72]">Delivered ✓</span>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {order.meals.map((meal, i) => (
                    <p key={i} className="text-xs text-[#7a6f65]">· {meal}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#252118]">
                  <span className="text-xs text-[#3a3028]">
                    {order.type === 'delivery' ? '🛵 Delivery' : '🏪 Pickup'}
                  </span>
                  <button
                    onClick={() => { setDeliveryType(null); setAddress(''); setKiosk(''); setSubPlan(null); setCheckoutOpen(true) }}
                    className="text-xs text-[#c8714a] hover:text-[#e8825a] transition-all"
                  >
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-[#161310] border border-[#252118] rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto">
            <div className="w-10 h-1 bg-[#3a3028] rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-bold text-[#f0ebe4] mb-1">How would you like it?</h2>
            <p className="text-sm text-[#7a6f65] mb-6">Choose a delivery method to continue.</p>

            <div className="space-y-3 mb-6">
              {[
                { key: 'delivery', icon: '🛵', title: 'Home / Office delivery', desc: 'Delivered fresh to your door' },
                { key: 'pickup', icon: '🏪', title: 'Kiosk pickup', desc: 'Pick up from a KCAL kiosk near you' },
                { key: 'subscription', icon: '📅', title: 'Subscribe & save', desc: 'Daily, weekly, or monthly plan' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setDeliveryType(opt.key as DeliveryType)}
                  className={`w-full text-left px-4 py-4 rounded-2xl border transition-all ${
                    deliveryType === opt.key
                      ? 'border-[#c8714a] bg-[#1e1410]'
                      : 'border-[#252118] bg-[#1c1916] hover:border-[#3a3028]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#e8e0d5]">{opt.title}</p>
                      <p className="text-xs text-[#5a5248] mt-0.5">{opt.desc}</p>
                    </div>
                    {deliveryType === opt.key && <span className="text-[#c8714a] text-sm">✓</span>}
                  </div>
                </button>
              ))}
            </div>

            {deliveryType === 'delivery' && (
              <div className="mb-6">
                <p className="text-xs text-[#5a5248] uppercase tracking-widest mb-3">Delivery address</p>
                <textarea
                  className="w-full rounded-xl border border-[#252118] bg-[#0e0c0a] px-4 py-3 text-white placeholder-[#3a3028] focus:outline-none focus:border-[#5a5248] text-sm resize-none transition-all"
                  placeholder="Enter your full address..."
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            )}

            {deliveryType === 'pickup' && (
              <div className="mb-6">
                <p className="text-xs text-[#5a5248] uppercase tracking-widest mb-3">Choose a kiosk</p>
                <div className="space-y-2">
                  {['KCAL Kiosk — Andheri West', 'KCAL Kiosk — Bandra Kurla Complex', 'KCAL Kiosk — Powai Lake'].map((k) => (
                    <button
                      key={k}
                      onClick={() => setKiosk(k)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        kiosk === k
                          ? 'border-[#c8714a] bg-[#1e1410] text-[#f0ebe4]'
                          : 'border-[#252118] text-[#7a6f65] hover:border-[#3a3028]'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {deliveryType === 'subscription' && (
              <div className="mb-6">
                <p className="text-xs text-[#5a5248] uppercase tracking-widest mb-3">Choose a plan</p>
                <div className="space-y-2">
                  {[
                    { key: 'daily', label: 'Daily', desc: 'Fresh plan every day', price: '₹250 / day' },
                    { key: 'weekly', label: 'Weekly', desc: '7 days, save 10%', price: '₹1,575 / week' },
                    { key: 'monthly', label: 'Monthly', desc: '30 days, save 20%', price: '₹6,000 / month' },
                  ].map((plan) => (
                    <button
                      key={plan.key}
                      onClick={() => setSubPlan(plan.key as any)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        subPlan === plan.key
                          ? 'border-[#c8714a] bg-[#1e1410]'
                          : 'border-[#252118] hover:border-[#3a3028]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-[#e8e0d5]">{plan.label}</p>
                          <p className="text-xs text-[#5a5248] mt-0.5">{plan.desc}</p>
                        </div>
                        <span className="text-sm text-[#c8bfb5]">{plan.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCheckoutOpen(false)}
                className="flex-1 rounded-2xl border border-[#2a2520] py-4 text-[#7a6f65] text-sm hover:border-[#5a5248] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                disabled={!canPlaceOrder()}
                className="flex-1 rounded-2xl bg-[#c8714a] py-4 text-white font-semibold text-sm hover:bg-[#b5623d] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Place order
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
            const active = item.path === '/orders'
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
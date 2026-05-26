'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Nav */}
      <div className="flex justify-between items-center px-6 py-5">
        <span className="text-lg font-bold tracking-tight">KCAL</span>
        <button
          onClick={() => router.push('/login')}
          className="text-sm text-gray-400 hover:text-white transition-all"
        >
          Sign in
        </button>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center px-6 max-w-md mx-auto w-full">
        <div className="mb-3">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Built for how you actually live</span>
        </div>
        <h1 className="text-5xl font-black leading-tight mb-6">
          No crashes.<br />All day<br />fuel.
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          KCAL learns your schedule, adapts to your habits, and builds a nutrition plan that actually sticks.
        </p>

        <button
          onClick={() => router.push('/login')}
          className="w-full rounded-2xl bg-white text-black py-4 font-semibold text-base hover:bg-gray-100 transition-all mb-4"
        >
          Get started →
        </button>
        <p className="text-center text-xs text-gray-600">
          Free to start. No credit card needed.
        </p>
      </div>

      {/* Social proof */}
      <div className="px-6 pb-8 max-w-md mx-auto w-full">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-white leading-relaxed mb-3">
            "I used to skip breakfast every day. KCAL moved it 30 minutes later and now I never miss it."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">A</div>
            <div>
              <p className="text-xs font-medium text-white">Arjun</p>
              <p className="text-xs text-gray-500">Business Analyst, Bangalore</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
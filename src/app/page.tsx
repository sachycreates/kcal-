'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const countersRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll fade-in
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))

    // Counters
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('.counter').forEach(el => {
            const target = parseInt(el.dataset.target || '0')
            const start = performance.now()
            const update = (now: number) => {
              const t = Math.min((now - start) / 2000, 1)
              const ease = 1 - Math.pow(1 - t, 3)
              el.textContent = Math.round(ease * target).toLocaleString()
              if (t < 1) requestAnimationFrame(update)
            }
            requestAnimationFrame(update)
          })
          counterObs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.3 })
    if (countersRef.current) counterObs.observe(countersRef.current)

    // Bars
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('.bar-fill').forEach(bar => {
            setTimeout(() => { bar.style.width = bar.dataset.width || '0%' }, 200)
          })
        }
      })
    }, { threshold: 0.3 })
    if (barsRef.current) barObs.observe(barsRef.current)

    return () => { observer.disconnect(); counterObs.disconnect(); barObs.disconnect() }
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0A0A0A', color: '#F0EDE8', overflowX: 'hidden' }}>

      <style>{`
        :root { scroll-behavior: smooth; }
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .bar-fill { transition: width 1.4s cubic-bezier(0.4,0,0.2,1); }
        .step-card:hover { border-color: rgba(232,114,58,0.35) !important; transform: translateY(-4px); }
        .plan-card:hover { transform: translateY(-4px); }
        .blog-card:hover { border-color: rgba(232,114,58,0.25) !important; transform: translateY(-4px); }
        .nav-link { color: #888480; text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .nav-link:hover { color: #F0EDE8; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-grid-1 { grid-template-columns: 1fr !important; }
          .mobile-grid-2 { grid-template-columns: 1fr 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 6%', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '0.18em', color: '#E8723A' }}>KCAL</span>
        <div className="desktop-only" style={{ display: 'flex', gap: 36 }}>
          <a href="#how" className="nav-link">How it works</a>
          <a href="#plans" className="nav-link">Plans</a>
          <a href="#blog" className="nav-link">Blog</a>
          <a href="#about" className="nav-link">Our story</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <button onClick={() => router.push('/onboarding')} style={{ background: '#E8723A', color: '#fff', border: 'none', borderRadius: 50, padding: '10px 24px', fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Get started →
        </button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 6% 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(232,114,58,0.15)', filter: 'blur(120px)', top: -100, right: -150, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(232,114,58,0.07)', filter: 'blur(120px)', bottom: 0, left: -100, pointerEvents: 'none' }} />
        <div className="hero-grid" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,114,58,0.12)', border: '1px solid rgba(232,114,58,0.25)', borderRadius: 50, padding: '6px 16px', marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, background: '#E8723A', borderRadius: '50%', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: '#E8723A' }}>Now live in beta</span>
            </div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(40px, 5.5vw, 68px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
              Your meals.<br />Your rhythm.<br /><span style={{ color: '#E8723A' }}>Your system.</span>
            </h1>
            <p style={{ fontSize: 18, fontWeight: 300, color: '#888480', lineHeight: 1.8, maxWidth: 480, marginBottom: 40 }}>
              KCAL is not a diet plan. It&apos;s an intelligent nutrition system that learns from your behaviour, adapts to your day, and makes eating well effortless — even on your busiest days.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
              <button onClick={() => router.push('/onboarding')} style={{ background: '#E8723A', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 32px', fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                Start eating better →
              </button>
              <a href="#how" style={{ background: 'transparent', color: '#F0EDE8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, padding: '14px 32px', fontFamily: "'Sora', sans-serif", fontWeight: 500, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
                See how it works
              </a>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(232,114,58,0.08), rgba(232,114,58,0.03))', border: '1px solid rgba(232,114,58,0.2)', borderRadius: 16, padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 14, maxWidth: 560 }}>
              <span style={{ width: 8, height: 8, background: '#E8723A', borderRadius: '50%', flexShrink: 0, marginTop: 6, animation: 'pulse 2s infinite', display: 'inline-block' }} />
              <p style={{ fontSize: 14, color: '#888480', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#F0EDE8' }}>KCAL adjusted your plan.</strong> You skipped lunch yesterday, so we moved today&apos;s meal to 12:30 PM and made it lighter — 420 kcal instead of 580. Your system is learning.
              </p>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="desktop-only" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: 280, background: '#111', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)', position: 'relative' }}>
              <div style={{ background: '#000', height: 28, borderRadius: '0 0 18px 18px', width: 100, margin: '12px auto 0', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
              <div style={{ padding: '52px 16px 24px' }}>
                <p style={{ fontSize: 10, color: '#888480', fontFamily: "'Sora', sans-serif", letterSpacing: '0.06em' }}>GOOD EVENING</p>
                <p style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Arjun 👋</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#181818', borderRadius: 16, padding: 14, marginBottom: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'conic-gradient(#E8723A 0% 62%, #181818 62% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 44, height: 44, background: '#181818', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora', sans-serif", fontSize: 9, fontWeight: 700 }}>62%</div>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: '#888480', marginBottom: 4 }}>TODAY&apos;S NUTRITION</p>
                    <p style={{ fontSize: 12, fontWeight: 500 }}>1116 / 1800 kcal</p>
                    <p style={{ fontSize: 11, color: '#888480', marginTop: 4 }}>Protein 42g · Carbs 78g</p>
                  </div>
                </div>
                <p style={{ fontSize: 9, letterSpacing: '0.08em', color: '#888480', fontFamily: "'Sora', sans-serif", marginBottom: 8 }}>TODAY&apos;S CURATED MEALS</p>
                {[{ type: '🌅 BREAKFAST', name: 'Moong Dal Chilla with Paneer', meta: '280 kcal · 18g protein', price: '₹110' }, { type: '🌿 LUNCH', name: 'Palak Paneer with 2 Rotis', meta: '380 kcal · 20g protein', price: '₹150' }].map((meal) => (
                  <div key={meal.type} style={{ background: '#181818', borderRadius: 14, padding: 12, marginBottom: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 9, color: '#E8723A', fontWeight: 600, fontFamily: "'Sora', sans-serif", letterSpacing: '0.06em' }}>{meal.type}</p>
                        <p style={{ fontSize: 11, fontWeight: 500, margin: '3px 0' }}>{meal.name}</p>
                        <p style={{ fontSize: 9, color: '#888480' }}>{meal.meta}</p>
                      </div>
                      <p style={{ fontSize: 11, fontWeight: 600 }}>{meal.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', top: '18%', right: -60, background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 14px' }}>
              <p style={{ fontSize: 9, color: '#888480', fontFamily: "'Sora', sans-serif" }}>🔥 STREAK</p>
              <p style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: '#E8723A' }}>12 days</p>
            </div>
            <div style={{ position: 'absolute', bottom: '22%', left: -70, background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 14px' }}>
              <p style={{ fontSize: 9, color: '#888480', fontFamily: "'Sora', sans-serif" }}>⚡ NEXT MEAL</p>
              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: '#E8723A' }}>In 1h 20m</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={countersRef} style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '60px 6%' }}>
        <div className="mobile-grid-2" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {[{ target: 2400, suffix: '+', label: 'Meals planned this month' }, { target: 340, suffix: '+', label: 'Beta users onboarded' }, { target: 87, suffix: '%', label: 'Meal completion rate' }, { target: 14, suffix: ' days', label: 'Average streak length' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '20px 12px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#E8723A', letterSpacing: '-0.03em' }}>
                <span className="counter" data-target={s.target}>0</span>{s.suffix}
              </div>
              <div style={{ fontSize: 13, color: '#888480', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '100px 6%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="fade-up">
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#E8723A', textTransform: 'uppercase', marginBottom: 16 }}>The System</p>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>Built around your life,<br />not the other way around.</h2>
            <p style={{ fontSize: 17, color: '#888480', fontWeight: 300, maxWidth: 540, lineHeight: 1.8, marginBottom: 60 }}>Most apps tell you what to eat. KCAL figures out when, what, and how much — based on how you actually live.</p>
          </div>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { num: '01', icon: '🎯', title: 'Personalise in 7 steps', desc: 'Tell KCAL your goals, wake time, diet preferences, and biggest barrier. Every question extracts a behavioural signal the system acts on immediately.' },
              { num: '02', icon: '⏰', title: 'Meals timed to your day', desc: 'Breakfast anchored to your wake time. Lunch before your meeting window. Dinner when you\'re actually home. Zero friction at the moment food should happen.' },
              { num: '03', icon: '🧠', title: 'The system learns from you', desc: 'Skip lunch at 1pm? Tomorrow KCAL moves it to 12:30 and drops 160 kcal. Every interaction — eat, skip, swap — makes the next recommendation smarter.' },
              { num: '04', icon: '🔥', title: 'Streaks that mean something', desc: 'KCAL streaks unlock real rewards — a nutrition drop at 5 days, a free meal credit at 10, a consistency badge at 21, and a legend merch drop at 30.' },
              { num: '05', icon: '🔄', title: 'Swap without guilt', desc: 'Not feeling the recommended dish? Hit swap. KCAL finds a nutritionally equivalent alternative that still fits your macros and delivery window.' },
              { num: '06', icon: '📦', title: 'Delivered to your door', desc: 'Every meal from our partner kitchens, timed for delivery before your next meeting. No cooking, no planning, no decision fatigue.' },
            ].map((s) => (
              <div key={s.num} className="step-card fade-up" style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 32, position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, transform 0.3s' }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 80, fontWeight: 800, color: 'rgba(232,114,58,0.06)', position: 'absolute', top: -10, right: 16, lineHeight: 1, userSelect: 'none' }}>{s.num}</div>
                <div style={{ fontSize: 28, marginBottom: 20 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#888480', lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" style={{ padding: '100px 6%', background: '#111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="fade-up">
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#E8723A', textTransform: 'uppercase', marginBottom: 16 }}>Plans</p>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>One system.<br />Three commitment levels.</h2>
            <p style={{ fontSize: 17, color: '#888480', fontWeight: 300, maxWidth: 540, lineHeight: 1.8, marginBottom: 60 }}>Start free and upgrade when you&apos;re ready. No lock-ins. Pause or cancel anytime.</p>
          </div>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { name: 'Starter', price: 'Free', period: 'forever', desc: 'Perfect for exploring KCAL and building your first week of habits.', features: ['7-day personalised meal plan', 'Basic nutritional dashboard', '2 meal swaps per week', 'Streak tracking', 'Email support'], featured: false },
              { name: 'Consistent', price: '₹799', period: '/ month', desc: 'For professionals who want a full, adapting nutrition system.', features: ['30-day adaptive meal plan', 'Full behavioural learning loop', 'Unlimited meal swaps', 'Priority delivery windows', 'Streak rewards unlocked', 'Macro & calorie tracking', 'Priority support'], featured: true },
              { name: 'Legend', price: '₹1499', period: '/ month', desc: 'Maximum personalisation, exclusive drops, and nutrition coaching.', features: ['Everything in Consistent', '1-on-1 nutrition check-in', 'Early access to new features', 'Exclusive 30-day merch drop', 'Pre/post-workout meal tagging', 'Dedicated account manager'], featured: false },
            ].map((plan) => (
              <div key={plan.name} className="plan-card fade-up" style={{ background: plan.featured ? 'linear-gradient(160deg, rgba(232,114,58,0.1) 0%, #131313 60%)' : '#131313', border: plan.featured ? '1px solid #E8723A' : '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 36, transition: 'transform 0.3s', position: 'relative' }}>
                {plan.featured && <div style={{ display: 'inline-block', background: '#E8723A', color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: "'Sora', sans-serif", letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 50, marginBottom: 20 }}>Most popular</div>}
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 800, color: '#E8723A', lineHeight: 1, marginBottom: 4 }}>{plan.price} <span style={{ fontSize: 16, fontWeight: 400, color: '#888480' }}>{plan.period}</span></div>
                <p style={{ fontSize: 13, color: '#888480', marginBottom: 28, marginTop: 8 }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', marginBottom: 32 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 14, color: '#888480', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#E8723A', fontWeight: 700, fontSize: 12 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push('/onboarding')} style={{ width: '100%', padding: 14, borderRadius: 50, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.15)', background: plan.featured ? '#E8723A' : 'transparent', color: plan.featured ? '#fff' : '#F0EDE8' }}>
                  {plan.name === 'Starter' ? 'Get started free' : plan.name === 'Consistent' ? 'Start your streak →' : 'Become a legend'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" style={{ padding: '100px 6%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 60 }}>
            <div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#E8723A', textTransform: 'uppercase', marginBottom: 16 }}>Nutrition Intel</p>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>The KCAL blog.</h2>
            </div>
            <a href="#" style={{ background: 'transparent', color: '#F0EDE8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, padding: '10px 24px', fontFamily: "'Sora', sans-serif", fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>All articles →</a>
          </div>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { bg: 'linear-gradient(135deg,#1a1a0a,#2a1f08)', emoji: '🥗', tag: 'Behaviour', title: 'Why willpower is not the problem — and what actually is', excerpt: 'The real reason Gen Z professionals skip meals isn\'t discipline. It\'s the absence of a system designed around their actual day.', author: 'Sachi Patil', time: '5 min read' },
              { bg: 'linear-gradient(135deg,#0a1a12,#08221a)', emoji: '🧠', tag: 'Nutrition Science', title: 'Protein timing and why your post-standup meal matters more than you think', excerpt: 'A 10am standup followed by a 1pm meeting with nothing in between is a biological sabotage. Here\'s the science.', author: 'KCAL Team', time: '7 min read' },
              { bg: 'linear-gradient(135deg,#1a0a14,#22081a)', emoji: '🔥', tag: 'Habits', title: 'The 21-day principle: how KCAL\'s streak system is built differently', excerpt: 'Streaks that unlock real rewards at 5, 10, 21, and 30 days — designed so motivation mirrors habit formation.', author: 'Sachi Patil', time: '4 min read' },
            ].map((post) => (
              <div key={post.title} className="blog-card fade-up" style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.3s, transform 0.3s', cursor: 'pointer' }}>
                <div style={{ height: 180, background: post.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>{post.emoji}</div>
                <div style={{ padding: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#E8723A', fontFamily: "'Sora', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{post.tag}</p>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: '#888480', lineHeight: 1.7 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 12, color: '#888480' }}>
                    <span>{post.author}</span><span>{post.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '100px 6%', background: '#111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div className="fade-up">
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#E8723A', textTransform: 'uppercase', marginBottom: 16 }}>Our Story</p>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>Built from a moment I couldn&apos;t forget.</h2>
              <p style={{ fontSize: 15, color: '#888480', lineHeight: 1.85, marginBottom: 16 }}>My brother moved to Bangalore for his first job. Back home, he was used to hot breakfast made by our mother every morning. In Bangalore, that routine disappeared overnight.</p>
              <p style={{ fontSize: 15, color: '#888480', lineHeight: 1.85, marginBottom: 24 }}>Some days he&apos;d go from a 9am standup straight to a 1pm meeting — skipping breakfast entirely, surviving on chai and whatever the office canteen had left. Not because he didn&apos;t care. But because the system around him made it easier to skip than to eat right.</p>
              <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid #E8723A', borderRadius: 16, padding: 28, fontSize: 16, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.8, marginBottom: 24 }}>
                &quot;That image — my brother, someone I grew up watching eat well, starving between back-to-back meetings in a new city — was the moment KCAL became real to me.&quot;
              </div>
              <p style={{ fontSize: 15, color: '#888480', lineHeight: 1.85 }}>KCAL is the system that should have existed for him. Built from scratch, by someone who believes the right product solves problems people didn&apos;t know they had a name for.</p>
            </div>
            <div ref={barsRef} className="fade-up" style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 40, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(232,114,58,0.1)', filter: 'blur(60px)', top: -40, right: -40, pointerEvents: 'none' }} />
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#E8723A', textTransform: 'uppercase', marginBottom: 28 }}>Why it works</p>
              {[
                { label: 'PERSONALISATION DEPTH', width: '90%', val: '90% of inputs are behavioural signals' },
                { label: 'SYSTEM ADAPTATION SPEED', width: '100%', val: 'Adapts every single day' },
                { label: 'RETENTION VS. GENERIC APPS', width: '75%', val: '3× higher 30-day return rate' },
                { label: 'ONBOARDING COMPLETION', width: '82%', val: '82% complete all 7 steps' },
              ].map((b) => (
                <div key={b.label} style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 12, color: '#888480', fontFamily: "'Sora', sans-serif", letterSpacing: '0.06em', marginBottom: 6 }}>{b.label}</p>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                    <div className="bar-fill" data-width={b.width} style={{ height: '100%', background: '#E8723A', borderRadius: 3, width: 0 }} />
                  </div>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: '#E8723A', marginTop: 4 }}>{b.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '100px 6%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <div className="fade-up">
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#E8723A', textTransform: 'uppercase', marginBottom: 16 }}>Get in touch</p>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>We&apos;d love to<br />hear from you.</h2>
              <p style={{ fontSize: 17, color: '#888480', fontWeight: 300, lineHeight: 1.8, marginBottom: 40 }}>Whether you&apos;re a potential partner, a user with feedback, or someone who wants to invest in what we&apos;re building.</p>
              {[
                { icon: '📧', title: 'Email us', desc: 'hello@kcal.app' },
                { icon: '📍', title: 'Based in', desc: 'Mumbai & Bangalore, India' },
                { icon: '⚡', title: 'Response time', desc: 'Within 24 hours, always' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(232,114,58,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: '#888480' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {['First name', 'Last name'].map(label => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#888480', fontFamily: "'Sora', sans-serif" }}>{label}</label>
                    <input type="text" style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', color: '#F0EDE8', fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none' }} />
                  </div>
                ))}
              </div>
              {[{ label: 'Email address', type: 'email' }, { label: 'Message', type: 'textarea' }].map(field => (
                <div key={field.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#888480', fontFamily: "'Sora', sans-serif" }}>{field.label}</label>
                  {field.type === 'textarea'
                    ? <textarea rows={5} style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', color: '#F0EDE8', fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none', resize: 'none' }} />
                    : <input type={field.type} style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', color: '#F0EDE8', fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none' }} />
                  }
                </div>
              ))}
              <button onClick={() => alert("Message sent! We'll be in touch within 24 hours.")} style={{ background: '#E8723A', color: '#fff', border: 'none', borderRadius: 12, padding: 16, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>
                Send message →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '60px 6% 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60, marginBottom: 60 }}>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '0.18em', color: '#E8723A', marginBottom: 16 }}>KCAL</div>
              <p style={{ fontSize: 14, color: '#888480', lineHeight: 1.7, maxWidth: 280 }}>A personalised nutrition system for Gen Z working professionals. Built with intention, one meal at a time.</p>
            </div>
            {[
              { title: 'Product', links: [{ label: 'How it works', href: '#how' }, { label: 'Pricing', href: '#plans' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'Streaks', href: '/streaks' }] },
              { title: 'Company', links: [{ label: 'Our story', href: '#about' }, { label: 'Blog', href: '#blog' }, { label: 'Contact', href: '#contact' }, { label: 'Careers', href: '#' }] },
              { title: 'Legal', links: [{ label: 'Privacy policy', href: '#' }, { label: 'Terms of service', href: '#' }, { label: 'Cookie policy', href: '#' }] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#F0EDE8', marginBottom: 20, textTransform: 'uppercase' }}>{col.title}</h4>
                <ul style={{ listStyle: 'none' }}>
                  {col.links.map(link => (
                    <li key={link.label} style={{ marginBottom: 12 }}>
                      <a href={link.href} style={{ fontSize: 14, color: '#888480', textDecoration: 'none' }}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 30, flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: '#888480' }}>© 2026 KCAL. Built by Sachi Patil. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['GH', '𝕏', 'in'].map(s => (
                <a key={s} href="#" style={{ width: 36, height: 36, borderRadius: 8, background: '#181818', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888480', fontSize: 13, textDecoration: 'none', fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
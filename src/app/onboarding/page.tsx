'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const steps = [
  {
    id: 1,
    question: "Let's personalise your plate.",
    subtitle: "Start with your first name.",
    type: "text",
    placeholder: "Your name",
    field: "name",
  },
  {
    id: 2,
    question: "What's your plate like?",
    subtitle: "Pick the one that fits best.",
    type: "choice",
    field: "diet_type",
    options: [
      { label: "Everything — meat, fish, eggs", value: "non-veg" },
      { label: "Vegetarian", value: "vegetarian" },
      { label: "Eggetarian — veg + eggs", value: "eggetarian" },
      { label: "Pescatarian — veg + fish & seafood", value: "pescatarian" },
      { label: "Vegan", value: "vegan" },
      { label: "No onion and garlic", value: "jain-style" },
    ],
  },
  {
    id: 3,
    question: "What are you eating for?",
    subtitle: "This shapes everything we recommend.",
    type: "choice",
    field: "goal",
    options: [
      { label: "Build muscle", value: "muscle" },
      { label: "Lose weight", value: "weight_loss" },
      { label: "Stay energised all day", value: "energy" },
      { label: "Just eat consistently", value: "consistency" },
    ],
  },
  {
    id: 4,
    question: "Any health conditions we should know about?",
    subtitle: "We'll make sure your meals work for you, not against you.",
    type: "multi_with_custom",
    field: "health_conditions",
    optional: true,
    options: [
      { label: "Diabetes or high blood sugar", value: "diabetes" },
      { label: "High blood pressure or cholesterol", value: "bp_cholesterol" },
      { label: "Thyroid condition", value: "thyroid" },
      { label: "PCOD / PCOS", value: "pcod" },
      { label: "Lactose or gluten intolerance", value: "intolerance" },
      { label: "None of the above", value: "none" },
    ],
  },
  {
    id: 5,
    question: "Any allergies or ingredients to avoid?",
    subtitle: "We'll keep these completely out of your meals.",
    type: "multi_with_custom",
    field: "allergies",
    optional: true,
    options: [
      { label: "Nuts & peanuts", value: "nuts" },
      { label: "Dairy", value: "dairy" },
      { label: "Eggs", value: "eggs" },
      { label: "Soy or shellfish", value: "soy_shellfish" },
      { label: "No restrictions", value: "none" },
    ],
  },
  {
    id: 6,
    question: "What time do you usually wake up?",
    subtitle: "We'll anchor your meals around this.",
    type: "time_picker",
    field: "wake_time",
  },
  {
    id: 7,
    question: "What gets in the way of eating well?",
    subtitle: "Pick up to two. Be honest.",
    type: "multi",
    field: "barriers",
    optional: true,
    options: [
      { label: "Back-to-back meetings", value: "meetings" },
      { label: "I forget to eat", value: "forgetting" },
      { label: "Too tired to decide", value: "fatigue" },
      { label: "Nothing nearby feels healthy", value: "options" },
      { label: "I just don't plan ahead", value: "planning" },
    ],
  },
]

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']
const PERIODS = ['AM', 'PM']

// Warm palette
const C = {
  bg: '#F8F5EF',
  card: '#FFFFFF',
  cocoa: '#5B4636',
  cocoaLight: '#7A6050',
  peach: '#FFB38A',
  peachDeep: '#E8935A',
  butter: '#FFD86B',
  sage: '#8EA889',
  border: '#E8E2D9',
  borderFocus: '#FFB38A',
  muted: '#A89880',
  textLight: '#C4B8A8',
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parseTime = (t: string) => {
    if (!t) return { hour: '06', minute: '00', period: 'AM' }
    const [hhmm, period] = t.split(' ')
    const [h, m] = hhmm.split(':')
    return { hour: h, minute: m, period: period || 'AM' }
  }

  const { hour, minute, period } = parseTime(value)

  const update = (h: string, m: string, p: string) => {
    onChange(`${h}:${m} ${p}`)
  }

  const ScrollCol = ({
    items,
    selected,
    onSelect,
  }: {
    items: string[]
    selected: string
    onSelect: (v: string) => void
  }) => (
    <div className="flex flex-col items-center gap-1 h-40 overflow-y-auto scrollbar-hide snap-y snap-mandatory">
      <div className="h-14 flex-shrink-0" />
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          style={{
            background: selected === item ? C.cocoa : 'transparent',
            color: selected === item ? '#FFF8F0' : C.muted,
            transform: selected === item ? 'scale(1.08)' : 'scale(1)',
            fontFamily: "'Sora', sans-serif",
            fontWeight: selected === item ? 700 : 400,
          }}
          className="snap-center w-16 h-10 rounded-xl text-base transition-all flex-shrink-0"
        >
          {item}
        </button>
      ))}
      <div className="h-14 flex-shrink-0" />
    </div>
  )

  return (
    <div>
      <div
        style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16 }}
        className="flex items-center justify-center gap-2"
      >
        <ScrollCol items={HOURS} selected={hour} onSelect={(h) => update(h, minute, period)} />
        <span style={{ color: C.muted, fontSize: 24, fontWeight: 300 }}>:</span>
        <ScrollCol items={MINUTES} selected={minute} onSelect={(m) => update(hour, m, period)} />
        <ScrollCol items={PERIODS} selected={period} onSelect={(p) => update(hour, minute, p)} />
      </div>
      <p style={{ color: C.textLight, fontSize: 12, textAlign: 'center', marginTop: 12 }}>Or type manually</p>
      <input
        type="time"
        style={{
          marginTop: 8, width: '100%', borderRadius: 14,
          border: `1px solid ${C.border}`, background: C.card,
          padding: '12px 16px', color: C.cocoa, fontSize: 14,
          outline: 'none', fontFamily: "'DM Sans', sans-serif",
        }}
        onChange={(e) => {
          const [h, m] = e.target.value.split(':')
          const hNum = parseInt(h)
          const p = hNum >= 12 ? 'PM' : 'AM'
          const h12 = hNum > 12 ? String(hNum - 12).padStart(2, '0') : hNum === 0 ? '12' : String(hNum).padStart(2, '0')
          update(h12, m, p)
        }}
      />
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const step = steps[currentStep]

  const canProceed = useCallback(() => {
    if ((step as any).optional) return true
    const val = answers[step.field]
    if (!val) return false
    if (step.type === 'multi' || step.type === 'multi_with_custom') return val.length > 0
    return val.toString().trim() !== ''
  }, [step, answers])

  const handleNext = useCallback(async () => {
    if (!canProceed() || loading) return
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setLoading(true)
      setError('')
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not logged in')
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            name: answers.name,
            diet_type: answers.diet_type,
            goal: answers.goal,
            health_conditions: answers.health_conditions || [],
            allergies: answers.allergies || [],
            wake_time: answers.wake_time,
            barriers: answers.barriers || [],
            onboarding_completed: true,
          })
          .eq('id', user.id)
        if (updateError) throw updateError
        router.push('/dashboard')
      } catch (err: any) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }
  }, [canProceed, loading, currentStep, answers, router])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        handleNext()
      }
      if (e.code === 'Enter') handleNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleNext])

  const updateAnswer = (value: any) => {
    setAnswers({ ...answers, [step.field]: value })
  }

  const toggleMulti = (value: string, maxSelect = 6) => {
    const current: string[] = answers[step.field] || []
    const isNone = value === 'none'
    if (isNone) {
      updateAnswer(current.includes('none') ? [] : ['none'])
      return
    }
    const withoutNone = current.filter(v => v !== 'none')
    if (withoutNone.includes(value)) {
      updateAnswer(withoutNone.filter(v => v !== value))
    } else if (withoutNone.length < maxSelect) {
      updateAnswer([...withoutNone, value])
    }
  }

  const addCustomValue = (field: string) => {
    const custom = customInputs[field]?.trim()
    if (!custom) return
    const current: string[] = answers[field] || []
    const customValue = `custom:${custom}`
    if (!current.includes(customValue)) {
      setAnswers({ ...answers, [field]: [...current.filter(v => v !== 'none'), customValue] })
    }
    setCustomInputs({ ...customInputs, [field]: '' })
  }

  const removeCustomValue = (field: string, val: string) => {
    const current: string[] = answers[field] || []
    setAnswers({ ...answers, [field]: current.filter(v => v !== val) })
  }

  const ready = canProceed()

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif", padding: '40px 16px' }}>

      {/* Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .option-btn:hover { border-color: ${C.peach} !important; }
      `}</style>

      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                height: 3, flex: 1, borderRadius: 2,
                background: i <= currentStep ? C.peachDeep : C.border,
                transition: 'background 0.4s ease',
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: 12, color: C.muted, marginBottom: 40, fontFamily: "'Sora', sans-serif", letterSpacing: '0.04em' }}>
          Step {currentStep + 1} of {steps.length}
        </p>

        {/* Question */}
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: C.cocoa, lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {step.question}
        </h1>
        <p style={{ fontSize: 15, color: C.muted, fontStyle: 'italic', fontWeight: 300, marginBottom: 28, lineHeight: 1.6 }}>
          {step.subtitle}
        </p>
        {(step as any).optional && (
          <p style={{ fontSize: 12, color: C.textLight, marginBottom: 16, marginTop: -12 }}>
            Optional — tap Skip if not applicable
          </p>
        )}

        {/* TEXT INPUT */}
        {step.type === 'text' && (
          <input
            type="text"
            autoFocus
            placeholder={step.placeholder}
            value={answers[step.field] || ''}
            onChange={(e) => updateAnswer(e.target.value)}
            style={{
              width: '100%', borderRadius: 16,
              border: `1.5px solid ${answers[step.field] ? C.peachDeep : C.border}`,
              background: C.card, padding: '16px 20px',
              color: C.cocoa, fontSize: 16, outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'border-color 0.2s',
              boxShadow: answers[step.field] ? `0 0 0 4px rgba(255,179,138,0.15)` : 'none',
            }}
          />
        )}

        {/* TIME PICKER */}
        {step.type === 'time_picker' && (
          <TimePicker value={answers[step.field] || ''} onChange={(v) => updateAnswer(v)} />
        )}

        {/* SINGLE CHOICE */}
        {step.type === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {step.options!.map((opt) => {
              const selected = answers[step.field] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => updateAnswer(opt.value)}
                  className="option-btn"
                  style={{
                    width: '100%', borderRadius: 14, textAlign: 'left',
                    padding: '15px 20px', fontSize: 15, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                    border: selected ? `1.5px solid ${C.peachDeep}` : `1.5px solid ${C.border}`,
                    background: selected ? C.peach : C.card,
                    color: selected ? C.cocoa : C.cocoaLight,
                    fontWeight: selected ? 600 : 400,
                    boxShadow: selected ? `0 4px 16px rgba(255,179,138,0.3)` : 'none',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

        {/* MULTI SELECT */}
        {step.type === 'multi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {step.options!.map((opt) => {
              const selected: string[] = answers[step.field] || []
              const isSelected = selected.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleMulti(opt.value, 2)}
                  className="option-btn"
                  style={{
                    width: '100%', borderRadius: 14, textAlign: 'left',
                    padding: '15px 20px', fontSize: 15, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                    border: isSelected ? `1.5px solid ${C.peachDeep}` : `1.5px solid ${C.border}`,
                    background: isSelected ? C.peach : C.card,
                    color: isSelected ? C.cocoa : C.cocoaLight,
                    fontWeight: isSelected ? 600 : 400,
                    boxShadow: isSelected ? `0 4px 16px rgba(255,179,138,0.3)` : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span style={{ fontSize: 12, color: C.cocoa }}>✓</span>}
                </button>
              )
            })}
          </div>
        )}

        {/* MULTI WITH CUSTOM */}
        {step.type === 'multi_with_custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {step.options!.map((opt) => {
              const selected: string[] = answers[step.field] || []
              const isSelected = selected.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleMulti(opt.value)}
                  className="option-btn"
                  style={{
                    width: '100%', borderRadius: 14, textAlign: 'left',
                    padding: '15px 20px', fontSize: 15, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                    border: isSelected ? `1.5px solid ${C.peachDeep}` : `1.5px solid ${C.border}`,
                    background: isSelected ? C.peach : C.card,
                    color: isSelected ? C.cocoa : C.cocoaLight,
                    fontWeight: isSelected ? 600 : 400,
                    boxShadow: isSelected ? `0 4px 16px rgba(255,179,138,0.3)` : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span style={{ fontSize: 12, color: C.cocoa }}>✓</span>}
                </button>
              )
            })}

            {((answers[step.field] || []) as string[])
              .filter((v: string) => v.startsWith('custom:'))
              .map((v: string) => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, border: `1.5px solid ${C.sage}`, background: '#F0F5EF', padding: '12px 20px' }}>
                  <span style={{ fontSize: 14, color: C.cocoa }}>{v.replace('custom:', '')}</span>
                  <button onClick={() => removeCustomValue(step.field, v)} style={{ color: C.muted, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
              ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                type="text"
                placeholder="Type something else..."
                value={customInputs[step.field] || ''}
                onChange={(e) => setCustomInputs({ ...customInputs, [step.field]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addCustomValue(step.field)}
                style={{
                  flex: 1, borderRadius: 14, border: `1.5px solid ${C.border}`,
                  background: C.card, padding: '12px 16px', color: C.cocoa,
                  fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button
                onClick={() => addCustomValue(step.field)}
                style={{
                  borderRadius: 14, border: `1.5px solid ${C.border}`,
                  background: C.card, padding: '12px 20px', color: C.cocoaLight,
                  fontSize: 14, cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontWeight: 600,
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {error && <p style={{ marginTop: 16, color: '#C0392B', fontSize: 14 }}>{error}</p>}

        {/* BUTTONS */}
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          {(step as any).optional && (
            <button
              onClick={() => {
                setAnswers({ ...answers, [step.field]: [] })
                if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
              }}
              style={{
                flex: 1, borderRadius: 14, border: `1.5px solid ${C.border}`,
                padding: '15px 20px', color: C.muted, fontSize: 14,
                background: 'transparent', cursor: 'pointer',
                fontFamily: "'Sora', sans-serif", fontWeight: 500,
              }}
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!ready || loading}
            style={{
              flex: 1, borderRadius: 14, border: 'none',
              padding: '15px 20px', fontSize: 15, cursor: ready ? 'pointer' : 'not-allowed',
              fontFamily: "'Sora', sans-serif", fontWeight: 700,
              background: ready ? C.cocoa : C.border,
              color: ready ? '#FFF8F0' : C.muted,
              transition: 'all 0.2s',
              boxShadow: ready ? `0 4px 20px rgba(91,70,54,0.25)` : 'none',
            }}
          >
            {loading ? 'Saving...' : currentStep === steps.length - 1 ? "Let's go →" : "Continue →"}
          </button>
        </div>

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: C.textLight, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            ← Back
          </button>
        )}

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: C.textLight }}>
          Press Space or Enter to continue
        </p>

      </div>
    </div>
  )
}
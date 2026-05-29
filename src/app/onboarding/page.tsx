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
          className={`snap-center w-16 h-10 rounded-lg text-base font-semibold transition-all flex-shrink-0 ${
            selected === item
              ? 'bg-white text-black scale-110'
              : 'text-gray-600 hover:text-gray-300'
          }`}
        >
          {item}
        </button>
      ))}
      <div className="h-14 flex-shrink-0" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-center gap-2 bg-gray-950 border border-gray-800 rounded-2xl p-4">
        <ScrollCol
          items={HOURS}
          selected={hour}
          onSelect={(h) => update(h, minute, period)}
        />
        <span className="text-2xl text-gray-600 font-light mb-1">:</span>
        <ScrollCol
          items={MINUTES}
          selected={minute}
          onSelect={(m) => update(hour, m, period)}
        />
        <ScrollCol
          items={PERIODS}
          selected={period}
          onSelect={(p) => update(hour, minute, p)}
        />
      </div>
      <p className="text-xs text-gray-600 mt-3 text-center">Or type manually</p>
      <input
        type="time"
        className="mt-2 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white focus:outline-none focus:border-gray-500 text-sm transition-all"
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

  // Spacebar to advance
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        handleNext()
      }
      if (e.code === 'Enter') {
        handleNext()
      }
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

  return (
    <div className="flex min-h-screen flex-col bg-black px-4 py-10">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">

        <div className="mb-2 flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? 'bg-white' : 'bg-gray-800'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 mb-10">Step {currentStep + 1} of {steps.length}</p>

        <h1 className="mb-2 text-3xl font-bold text-white leading-tight">{step.question}</h1>
        <p className="mb-8 text-gray-500 text-sm leading-relaxed italic">{step.subtitle}</p>
        {(step as any).optional && (
          <p className="text-xs text-gray-600 mb-4 -mt-4">Optional — tap Skip if not applicable</p>
        )}

        {step.type === 'text' && (
          <input
            type="text"
            autoFocus
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-gray-500 text-base transition-all"
            placeholder={step.placeholder}
            value={answers[step.field] || ''}
            onChange={(e) => updateAnswer(e.target.value)}
          />
        )}

        {step.type === 'time_picker' && (
          <TimePicker
            value={answers[step.field] || ''}
            onChange={(v) => updateAnswer(v)}
          />
        )}

        {step.type === 'choice' && (
          <div className="space-y-3">
            {step.options!.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateAnswer(opt.value)}
                className={`w-full rounded-xl border px-4 py-4 text-left transition-all text-sm ${
                  answers[step.field] === opt.value
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-gray-800 bg-gray-950 text-gray-300 hover:border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step.type === 'multi' && (
          <div className="space-y-3">
            {step.options!.map((opt) => {
              const selected: string[] = answers[step.field] || []
              const isSelected = selected.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleMulti(opt.value, 2)}
                  className={`w-full rounded-xl border px-4 py-4 text-left transition-all text-sm flex items-center justify-between ${
                    isSelected
                      ? 'border-white bg-white text-black font-semibold'
                      : 'border-gray-800 bg-gray-950 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              )
            })}
          </div>
        )}

        {step.type === 'multi_with_custom' && (
          <div className="space-y-3">
            {step.options!.map((opt) => {
              const selected: string[] = answers[step.field] || []
              const isSelected = selected.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleMulti(opt.value)}
                  className={`w-full rounded-xl border px-4 py-4 text-left transition-all text-sm flex items-center justify-between ${
                    isSelected
                      ? 'border-white bg-white text-black font-semibold'
                      : 'border-gray-800 bg-gray-950 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              )
            })}

            {((answers[step.field] || []) as string[])
              .filter((v: string) => v.startsWith('custom:'))
              .map((v: string) => (
                <div key={v} className="flex items-center justify-between rounded-xl border border-gray-600 bg-gray-900 px-4 py-3">
                  <span className="text-sm text-white">{v.replace('custom:', '')}</span>
                  <button onClick={() => removeCustomValue(step.field, v)} className="text-gray-500 hover:text-white text-xs ml-2">✕</button>
                </div>
              ))}

            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="flex-1 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                placeholder="Type something else..."
                value={customInputs[step.field] || ''}
                onChange={(e) => setCustomInputs({ ...customInputs, [step.field]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addCustomValue(step.field)}
              />
              <button
                onClick={() => addCustomValue(step.field)}
                className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white text-sm hover:border-gray-500 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        <div className="mt-8 flex gap-3">
          {(step as any).optional && (
            <button
              onClick={() => {
                setAnswers({ ...answers, [step.field]: [] })
                if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
              }}
              className="flex-1 rounded-xl border border-gray-800 px-4 py-4 text-gray-500 text-sm hover:border-gray-600 transition-all"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex-1 rounded-xl bg-white px-4 py-4 font-semibold text-black disabled:opacity-20 hover:bg-gray-100 transition-all text-sm"
          >
            {loading ? 'Saving...' : currentStep === steps.length - 1 ? "Let's go →" : "Continue →"}
          </button>
        </div>

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-4 text-center text-xs text-gray-700 hover:text-gray-500 transition-all"
          >
            ← Back
          </button>
        )}

        <p className="mt-6 text-center text-xs text-gray-800">Press Space or Enter to continue</p>

      </div>
    </div>
  )
}
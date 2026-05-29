'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyhpffdkmkehqjetjled.supabase.co'
const supabaseAnonKey = 'sb_publishable_KtP6zWrdRDDUL-RhFz80Tg_Qa9XEnp2'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const steps = [
  {
    id: 1,
    question: "First, what do we call you?",
    subtitle: "Just your first name is fine.",
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
      { label: "Everything", value: "non-veg" },
      { label: "Vegetarian", value: "vegetarian" },
      { label: "Vegan", value: "vegan" },
      { label: "Plant-based. No onion, garlic or roots.", value: "jain-style" },
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
    type: "multi",
    field: "health_conditions",
    optional: true,
    options: [
      { label: "Diabetes / Pre-diabetes", value: "diabetes" },
      { label: "High blood pressure", value: "hypertension" },
      { label: "High cholesterol", value: "cholesterol" },
      { label: "Thyroid condition", value: "thyroid" },
      { label: "PCOD / PCOS", value: "pcod" },
      { label: "Lactose intolerance", value: "lactose" },
      { label: "Gluten sensitivity", value: "gluten" },
      { label: "None of the above", value: "none" },
    ],
  },
  {
    id: 5,
    question: "Any allergies or ingredients to avoid?",
    subtitle: "Pick all that apply. We'll keep these out of your meals.",
    type: "multi",
    field: "allergies",
    optional: true,
    options: [
      { label: "Nuts & peanuts", value: "nuts" },
      { label: "Dairy", value: "dairy" },
      { label: "Eggs", value: "eggs" },
      { label: "Soy", value: "soy" },
      { label: "Shellfish", value: "shellfish" },
      { label: "Mustard", value: "mustard" },
      { label: "No restrictions", value: "none" },
    ],
  },
  {
    id: 6,
    question: "What time do you usually wake up?",
    subtitle: "We'll anchor your meals around this.",
    type: "time",
    field: "wake_time",
    placeholder: "e.g. 7:00 AM",
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

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const step = steps[currentStep]

  const handleNext = async () => {
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
  }

  const updateAnswer = (value: any) => {
    setAnswers({ ...answers, [step.field]: value })
  }

  const toggleMulti = (value: string) => {
    const current: string[] = answers[step.field] || []
    const isNone = value === 'none'
    const hasNone = current.includes('none')

    if (isNone) {
      updateAnswer(current.includes('none') ? [] : ['none'])
      return
    }
    if (hasNone) {
      updateAnswer([value])
      return
    }
    const maxSelect = step.field === 'barriers' ? 2 : 6
    if (current.includes(value)) {
      updateAnswer(current.filter((v) => v !== value))
    } else if (current.length < maxSelect) {
      updateAnswer([...current, value])
    }
  }

  const canProceed = () => {
    if ((step as any).optional) return true
    const val = answers[step.field]
    if (!val) return false
    if (step.type === 'multi') return val.length > 0
    return val.toString().trim() !== ''
  }

  const progressPercent = ((currentStep) / (steps.length - 1)) * 100

  return (
    <div className="flex min-h-screen flex-col bg-black px-4 py-10">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">

        {/* Progress */}
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

        {/* Question */}
        <h1 className="mb-2 text-3xl font-bold text-white leading-tight">{step.question}</h1>
        <p className="mb-8 text-gray-500 text-sm leading-relaxed">{step.subtitle}</p>
        {(step as any).optional && (
          <p className="text-xs text-gray-600 mb-4 -mt-4">Optional — tap Skip if not applicable</p>
        )}

        {/* Inputs */}
        {step.type === 'text' && (
          <input
            type="text"
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-gray-500 text-base transition-all"
            placeholder={step.placeholder}
            value={answers[step.field] || ''}
            onChange={(e) => updateAnswer(e.target.value)}
          />
        )}

        {step.type === 'time' && (
          <input
            type="time"
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-4 text-white focus:outline-none focus:border-gray-500 text-base transition-all"
            value={answers[step.field] || ''}
            onChange={(e) => updateAnswer(e.target.value)}
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
                  onClick={() => toggleMulti(opt.value)}
                  className={`w-full rounded-xl border px-4 py-4 text-left transition-all text-sm flex items-center justify-between ${
                    isSelected
                      ? 'border-white bg-white text-black font-semibold'
                      : 'border-gray-800 bg-gray-950 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="text-black text-xs">✓</span>}
                </button>
              )
            })}
          </div>
        )}

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        {/* Actions */}
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

      </div>
    </div>
  )
}
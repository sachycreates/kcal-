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
    question: "What time do you usually wake up?",
    subtitle: "We'll anchor your meals around this.",
    type: "time",
    field: "wake_time",
    placeholder: "e.g. 7:00 AM",
  },
  {
    id: 5,
    question: "What gets in the way of eating well?",
    subtitle: "Pick up to two. Be honest.",
    type: "multi",
    field: "barriers",
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
      // Last step — save to Supabase
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
            wake_time: answers.wake_time,
            barriers: answers.barriers,
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
    if (current.includes(value)) {
      updateAnswer(current.filter((v) => v !== value))
    } else if (current.length < 2) {
      updateAnswer([...current, value])
    }
  }

  const canProceed = () => {
    const val = answers[step.field]
    if (!val) return false
    if (step.type === 'multi') return val.length > 0
    return val.toString().trim() !== ''
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-8 flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= currentStep ? 'bg-white' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <h1 className="mb-2 text-3xl font-bold text-white">{step.question}</h1>
        <p className="mb-8 text-gray-400">{step.subtitle}</p>

        {/* Input */}
        {step.type === 'text' && (
          <input
            type="text"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white"
            placeholder={step.placeholder}
            value={answers[step.field] || ''}
            onChange={(e) => updateAnswer(e.target.value)}
          />
        )}

        {step.type === 'time' && (
          <input
            type="time"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:outline-none focus:border-white"
            value={answers[step.field] || ''}
            onChange={(e) => updateAnswer(e.target.value)}
          />
        )}

        {(step.type === 'choice') && (
          <div className="space-y-3">
            {step.options!.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateAnswer(opt.value)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-all ${
                  answers[step.field] === opt.value
                    ? 'border-white bg-white text-black font-medium'
                    : 'border-gray-700 bg-gray-900 text-white hover:border-gray-400'
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
                  className={`w-full rounded-lg border px-4 py-3 text-left transition-all ${
                    isSelected
                      ? 'border-white bg-white text-black font-medium'
                      : 'border-gray-700 bg-gray-900 text-white hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className="mt-8 w-full rounded-lg bg-white px-4 py-3 font-semibold text-black disabled:opacity-30 hover:bg-gray-100 transition-all"
        >
          {loading ? 'Saving...' : currentStep === steps.length - 1 ? "Let's go →" : "That's me →"}
        </button>
      </div>
    </div>
  )
}
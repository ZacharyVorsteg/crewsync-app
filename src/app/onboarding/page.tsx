'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Alert } from '@/components/ui/Alert'
import { Building2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

const employeeOptions = [
  { value: '1-5', label: '1-5 employees' },
  { value: '6-10', label: '6-10 employees' },
  { value: '11-25', label: '11-25 employees' },
  { value: '26-50', label: '26-50 employees' },
  { value: '51-100', label: '51-100 employees' },
  { value: '100+', label: '100+ employees' },
]

const siteOptions = [
  { value: '1-10', label: '1-10 sites' },
  { value: '11-25', label: '11-25 sites' },
  { value: '26-50', label: '26-50 sites' },
  { value: '51-100', label: '51-100 sites' },
  { value: '100+', label: '100+ sites' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [siteCount, setSiteCount] = useState('')

  const handleComplete = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Please sign in to continue')
        return
      }

      // Create the company
      const { error: companyError } = await supabase.from('companies').insert({
        user_id: user.id,
        name: companyName,
        phone,
        address,
        email: user.email,
        subscription_status: 'trial',
      })

      if (companyError) {
        setError(companyError.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      title: 'Company Info',
      description: 'Tell us about your business',
    },
    {
      title: 'Operations',
      description: 'Help us customize your experience',
    },
    {
      title: 'Complete',
      description: 'You\'re all set!',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CrewSync</span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.title} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
                    step > index + 1
                      ? 'bg-green-500 text-white'
                      : step === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > index + 1 ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className="font-medium text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-500">{s.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-24 h-1 mx-4 ${
                    step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {error && (
            <Alert variant="danger" className="mb-6">
              {error}
            </Alert>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Tell us about your company
                </h2>
                <p className="text-gray-600">
                  This information helps us customize CrewSync for your needs.
                </p>
              </div>

              <Input
                label="Company name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., CleanPro Services"
                required
              />

              <Input
                label="Phone number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />

              <Input
                label="Business address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State ZIP"
              />

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!companyName}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Tell us about your operations
                </h2>
                <p className="text-gray-600">
                  This helps us recommend the right plan for you.
                </p>
              </div>

              <Select
                label="How many employees do you have?"
                options={employeeOptions}
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                placeholder="Select employee count"
              />

              <Select
                label="How many sites do you service?"
                options={siteOptions}
                value={siteCount}
                onChange={(e) => setSiteCount(e.target.value)}
                placeholder="Select site count"
              />

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  You&apos;re all set!
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your 14-day free trial is ready. Let&apos;s get your first site and crew member set up.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
                <h3 className="font-medium text-gray-900 mb-4">
                  Quick start guide:
                </h3>
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="font-medium text-blue-600">1.</span>
                    Add your first cleaning site
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-blue-600">2.</span>
                    Invite your crew members
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-blue-600">3.</span>
                    Create your first schedule
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-blue-600">4.</span>
                    Have your crew download the mobile app
                  </li>
                </ol>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { Company } from '@/types/database'
import { Building2, MapPin, Bell, CreditCard, Save } from 'lucide-react'

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    geofence_radius: 100,
    noshow_alert_minutes: 15,
  })

  const supabase = createClient()
  const toast = useToast()

  useEffect(() => {
    loadCompany()
  }, [])

  const loadCompany = async () => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: companyData } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (companyData) {
      setCompany(companyData)
      setFormData({
        name: companyData.name,
        phone: companyData.phone || '',
        email: companyData.email || '',
        address: companyData.address || '',
        geofence_radius: companyData.geofence_radius,
        noshow_alert_minutes: companyData.noshow_alert_minutes,
      })
    }

    setIsLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company) return

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.name,
          phone: formData.phone || null,
          email: formData.email || null,
          address: formData.address || null,
          geofence_radius: formData.geofence_radius,
          noshow_alert_minutes: formData.noshow_alert_minutes,
        })
        .eq('id', company.id)

      if (error) throw error
      toast.success('Settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const geofenceOptions = [
    { value: '50', label: '50 meters (Very Strict)' },
    { value: '100', label: '100 meters (Recommended)' },
    { value: '150', label: '150 meters (Moderate)' },
    { value: '200', label: '200 meters (Relaxed)' },
    { value: '500', label: '500 meters (Very Relaxed)' },
  ]

  const alertOptions = [
    { value: '5', label: '5 minutes' },
    { value: '10', label: '10 minutes' },
    { value: '15', label: '15 minutes (Recommended)' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your company settings</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <Input
                label="Business Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* GPS Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                GPS & Geofencing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Geofence Radius"
                options={geofenceOptions}
                value={formData.geofence_radius.toString()}
                onChange={(e) => setFormData({ ...formData, geofence_radius: parseInt(e.target.value) })}
                hint="How close crew members must be to a site to clock in with GPS verification"
              />
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How Geofencing Works</h4>
                <p className="text-sm text-blue-700">
                  When crew members clock in, we check their GPS location against the site address.
                  If they&apos;re within the geofence radius, the clock-in is marked as &ldquo;GPS Verified&rdquo;.
                  If not, the clock-in still goes through, but you&apos;ll receive an alert.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alert Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="No-Show Alert Delay"
                options={alertOptions}
                value={formData.noshow_alert_minutes.toString()}
                onChange={(e) => setFormData({ ...formData, noshow_alert_minutes: parseInt(e.target.value) })}
                hint="How long to wait after a scheduled start time before sending a no-show alert"
              />
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">
                      {company?.subscription_tier ? company.subscription_tier.charAt(0).toUpperCase() + company.subscription_tier.slice(1) : 'Trial'}
                    </h4>
                    <Badge variant={company?.subscription_status === 'active' ? 'success' : 'warning'}>
                      {company?.subscription_status || 'Trial'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {company?.subscription_status === 'trial'
                      ? 'Your free trial is active'
                      : 'Your subscription is active'}
                  </p>
                </div>
                <Button variant="outline">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

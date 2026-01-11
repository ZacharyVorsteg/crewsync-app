'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/contexts/ToastContext'
import { Site } from '@/types/database'

interface SiteFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Site>) => Promise<void>
  site?: Site | null
}

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export function SiteForm({ isOpen, onClose, onSave, site }: SiteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    budget_hours: '',
    service_frequency: 'weekly',
    notes: '',
    latitude: '',
    longitude: '',
  })

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name,
        address: site.address,
        client_name: site.client_name || '',
        client_email: site.client_email || '',
        client_phone: site.client_phone || '',
        budget_hours: site.budget_hours?.toString() || '',
        service_frequency: site.service_frequency || 'weekly',
        notes: site.notes || '',
        latitude: site.latitude?.toString() || '',
        longitude: site.longitude?.toString() || '',
      })
    } else {
      setFormData({
        name: '',
        address: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        budget_hours: '',
        service_frequency: 'weekly',
        notes: '',
        latitude: '',
        longitude: '',
      })
    }
  }, [site])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave({
        name: formData.name,
        address: formData.address,
        client_name: formData.client_name || null,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        budget_hours: formData.budget_hours ? parseFloat(formData.budget_hours) : null,
        service_frequency: formData.service_frequency || null,
        notes: formData.notes || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      })
      onClose()
    } catch (error) {
      toast.error('Failed to save site')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressLookup = async () => {
    if (!formData.address) return

    try {
      // Use browser's Geocoding API via fetch to a geocoding service
      // For production, you'd use Google Maps Geocoding API or similar
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        setFormData({
          ...formData,
          latitude: data[0].lat,
          longitude: data[0].lon,
        })
      }
    } catch {
      // Geocoding failed - user can enter coordinates manually
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={site ? 'Edit Site' : 'Add New Site'}
      description={site ? 'Update site details' : 'Add a new cleaning site'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Site Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Downtown Office Building"
              required
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, City, State ZIP"
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddressLookup}
                className="mt-6"
              >
                Get Coordinates
              </Button>
            </div>
          </div>

          <Input
            label="Latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            placeholder="Optional - for GPS verification"
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            placeholder="Optional - for GPS verification"
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-900 mb-4">Client Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Client Name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="Contact person name"
            />

            <Input
              label="Client Phone"
              type="tel"
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
              placeholder="(555) 123-4567"
            />

            <div className="md:col-span-2">
              <Input
                label="Client Email"
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                placeholder="client@company.com"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-900 mb-4">Service Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Service Frequency"
              options={frequencyOptions}
              value={formData.service_frequency}
              onChange={(e) => setFormData({ ...formData, service_frequency: e.target.value })}
            />

            <Input
              label="Budget Hours (per cleaning)"
              type="number"
              step="0.5"
              value={formData.budget_hours}
              onChange={(e) => setFormData({ ...formData, budget_hours: e.target.value })}
              placeholder="e.g., 4.5"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Access instructions, special requirements, etc."
                rows={3}
              />
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {site ? 'Update Site' : 'Add Site'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { useToast } from '@/contexts/ToastContext'
import { Site, CrewMember, Schedule } from '@/types/database'
import { format } from 'date-fns'

interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Schedule>) => Promise<void>
  schedule?: Schedule | null
  sites: Site[]
  crewMembers: CrewMember[]
  selectedDate?: Date
}

export function AssignmentModal({
  isOpen,
  onClose,
  onSave,
  schedule,
  sites,
  crewMembers,
  selectedDate,
}: AssignmentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const [formData, setFormData] = useState({
    site_id: '',
    crew_member_id: '',
    scheduled_date: '',
    start_time: '09:00',
    end_time: '12:00',
    is_recurring: false,
    recurrence_rule: '',
  })

  useEffect(() => {
    if (schedule) {
      setFormData({
        site_id: schedule.site_id || '',
        crew_member_id: schedule.crew_member_id || '',
        scheduled_date: schedule.scheduled_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        is_recurring: schedule.is_recurring,
        recurrence_rule: schedule.recurrence_rule || '',
      })
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        scheduled_date: format(selectedDate, 'yyyy-MM-dd'),
      }))
    }
  }, [schedule, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      toast.error('Failed to save schedule')
    } finally {
      setIsLoading(false)
    }
  }

  const siteOptions = sites.map((site) => ({
    value: site.id,
    label: site.name,
  }))

  const crewOptions = [
    { value: '', label: 'Unassigned' },
    ...crewMembers.map((member) => ({
      value: member.id,
      label: member.name,
    })),
  ]

  const recurrenceOptions = [
    { value: '', label: 'Does not repeat' },
    { value: 'FREQ=DAILY', label: 'Daily' },
    { value: 'FREQ=WEEKLY', label: 'Weekly' },
    { value: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', label: 'Weekdays' },
    { value: 'FREQ=WEEKLY;BYDAY=MO,WE,FR', label: 'Mon, Wed, Fri' },
    { value: 'FREQ=WEEKLY;BYDAY=TU,TH', label: 'Tue, Thu' },
    { value: 'FREQ=BIWEEKLY', label: 'Every 2 weeks' },
    { value: 'FREQ=MONTHLY', label: 'Monthly' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule ? 'Edit Schedule' : 'Create Schedule'}
      description={schedule ? 'Update the schedule details' : 'Assign a crew member to a site'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Site"
          options={siteOptions}
          value={formData.site_id}
          onChange={(e) => setFormData({ ...formData, site_id: e.target.value })}
          placeholder="Select a site"
          required
        />

        <Select
          label="Crew Member"
          options={crewOptions}
          value={formData.crew_member_id}
          onChange={(e) => setFormData({ ...formData, crew_member_id: e.target.value })}
        />

        <Input
          label="Date"
          type="date"
          value={formData.scheduled_date}
          onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
          />
          <Input
            label="End Time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            required
          />
        </div>

        <Select
          label="Repeat"
          options={recurrenceOptions}
          value={formData.recurrence_rule}
          onChange={(e) =>
            setFormData({
              ...formData,
              recurrence_rule: e.target.value,
              is_recurring: !!e.target.value,
            })
          }
        />

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {schedule ? 'Update Schedule' : 'Create Schedule'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

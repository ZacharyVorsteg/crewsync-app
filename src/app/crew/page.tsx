'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { CrewMember } from '@/types/database'
import { Plus, Search, Users, Phone, Mail, MoreVertical, Edit, Trash2 } from 'lucide-react'

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Mandarin' },
]

export default function CrewPage() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    language: 'en',
    hourly_rate: '',
  })

  const supabase = createClient()
  const toast = useToast()

  useEffect(() => {
    loadCrewMembers()
  }, [])

  const loadCrewMembers = async () => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!company) return
    setCompanyId(company.id)

    const { data: crewData } = await supabase
      .from('crew_members')
      .select('*')
      .eq('company_id', company.id)
      .order('name')

    setCrewMembers(crewData || [])
    setIsLoading(false)
  }

  const handleOpenModal = (member?: CrewMember) => {
    if (member) {
      setSelectedMember(member)
      setFormData({
        name: member.name,
        phone: member.phone || '',
        email: member.email || '',
        language: member.language,
        hourly_rate: member.hourly_rate?.toString() || '',
      })
    } else {
      setSelectedMember(null)
      setFormData({
        name: '',
        phone: '',
        email: '',
        language: 'en',
        hourly_rate: '',
      })
    }
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyId) return

    const data = {
      name: formData.name,
      phone: formData.phone || null,
      email: formData.email || null,
      language: formData.language,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
    }

    try {
      if (selectedMember) {
        const { error } = await supabase
          .from('crew_members')
          .update(data)
          .eq('id', selectedMember.id)

        if (error) throw error
        toast.success('Crew member updated')
      } else {
        const { error } = await supabase
          .from('crew_members')
          .insert({ ...data, company_id: companyId })

        if (error) throw error
        toast.success('Crew member added')
      }

      setModalOpen(false)
      loadCrewMembers()
    } catch (error) {
      toast.error('Failed to save crew member')
    }
  }

  const handleToggleActive = async (member: CrewMember) => {
    await supabase
      .from('crew_members')
      .update({ is_active: !member.is_active })
      .eq('id', member.id)

    loadCrewMembers()
  }

  const filteredCrew = crewMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone?.includes(searchQuery)
  )

  const activeCrew = filteredCrew.filter((m) => m.is_active)
  const inactiveCrew = filteredCrew.filter((m) => !m.is_active)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crew Members</h1>
            <p className="text-gray-500">Manage your cleaning team</p>
          </div>
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
            Add Crew Member
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Input
            placeholder="Search crew members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
          />
        </div>

        {/* Crew list */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : crewMembers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crew members yet</h3>
            <p className="text-gray-500 mb-6">Add your first crew member to get started</p>
            <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
              Add Crew Member
            </Button>
          </div>
        ) : (
          <>
            {activeCrew.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Active Crew ({activeCrew.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCrew.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name} size="lg" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <Badge variant="success" size="sm">Active</Badge>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenModal(member)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {member.phone}
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {member.email}
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                          <span>Language: {languageOptions.find(l => l.value === member.language)?.label}</span>
                          {member.hourly_rate && <span>${member.hourly_rate}/hr</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleActive(member)}
                        className="mt-4 w-full text-sm text-gray-500 hover:text-red-600"
                      >
                        Deactivate
                      </button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {inactiveCrew.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-500 mb-4">
                  Inactive Crew ({inactiveCrew.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {inactiveCrew.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name} size="lg" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <Badge variant="default" size="sm">Inactive</Badge>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleActive(member)}
                        className="w-full text-sm text-blue-600 hover:text-blue-800"
                      >
                        Reactivate
                      </button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedMember ? 'Edit Crew Member' : 'Add Crew Member'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
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
          <Select
            label="Language"
            options={languageOptions}
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          />
          <Input
            label="Hourly Rate ($)"
            type="number"
            step="0.01"
            value={formData.hourly_rate}
            onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
          />
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedMember ? 'Update' : 'Add'} Crew Member
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

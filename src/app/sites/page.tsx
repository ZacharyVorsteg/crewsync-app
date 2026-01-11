'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SiteCard, SiteForm } from '@/components/sites'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { Site } from '@/types/database'
import { Plus, Search, MapPin, Building2 } from 'lucide-react'

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)

  const supabase = createClient()
  const toast = useToast()

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
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

    const { data: sitesData } = await supabase
      .from('sites')
      .select('*')
      .eq('company_id', company.id)
      .order('name')

    setSites(sitesData || [])
    setIsLoading(false)
  }

  const handleSave = async (data: Partial<Site>) => {
    if (!companyId) return

    try {
      if (selectedSite) {
        const { error } = await supabase
          .from('sites')
          .update(data)
          .eq('id', selectedSite.id)

        if (error) throw error
        toast.success('Site updated')
      } else {
        const { error } = await supabase
          .from('sites')
          .insert({ ...data, company_id: companyId })

        if (error) throw error
        toast.success('Site created')
      }

      loadSites()
    } catch (error) {
      toast.error('Failed to save site')
      throw error
    }
  }

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeSites = filteredSites.filter((s) => s.is_active)
  const inactiveSites = filteredSites.filter((s) => !s.is_active)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
            <p className="text-gray-500">Manage your cleaning locations</p>
          </div>
          <Button
            onClick={() => {
              setSelectedSite(null)
              setModalOpen(true)
            }}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Site
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Input
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
          />
        </div>

        {/* Sites grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sites yet
            </h3>
            <p className="text-gray-500 mb-6">
              Add your first cleaning site to get started
            </p>
            <Button
              onClick={() => {
                setSelectedSite(null)
                setModalOpen(true)
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Site
            </Button>
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sites found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          <>
            {activeSites.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Active Sites ({activeSites.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSites.map((site) => (
                    <SiteCard
                      key={site.id}
                      site={site}
                      onClick={() => {
                        setSelectedSite(site)
                        setModalOpen(true)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {inactiveSites.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-500 mb-4">
                  Inactive Sites ({inactiveSites.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {inactiveSites.map((site) => (
                    <SiteCard
                      key={site.id}
                      site={site}
                      onClick={() => {
                        setSelectedSite(site)
                        setModalOpen(true)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Site form modal */}
      <SiteForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedSite(null)
        }}
        onSave={handleSave}
        site={selectedSite}
      />
    </DashboardLayout>
  )
}

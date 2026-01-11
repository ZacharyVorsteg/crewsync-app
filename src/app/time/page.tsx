'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { TimeEntryWithRelations, CrewMember, Site } from '@/types/database'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { formatHours } from '@/lib/utils'
import { Search, Download, Clock, MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function TimePage() {
  const [timeEntries, setTimeEntries] = useState<TimeEntryWithRelations[]>([])
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  })
  const [filterCrew, setFilterCrew] = useState('')
  const [filterSite, setFilterSite] = useState('')

  const supabase = createClient()
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [dateRange])

  const loadData = async () => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!company) return

    // Load time entries
    const { data: entries } = await supabase
      .from('time_entries')
      .select(`
        *,
        crew_member:crew_members(*),
        site:sites(*),
        schedule:schedules(*)
      `)
      .eq('company_id', company.id)
      .gte('clock_in', `${dateRange.start}T00:00:00`)
      .lte('clock_in', `${dateRange.end}T23:59:59`)
      .order('clock_in', { ascending: false })

    setTimeEntries(entries || [])

    // Load crew members for filter
    const { data: crew } = await supabase
      .from('crew_members')
      .select('*')
      .eq('company_id', company.id)
      .eq('is_active', true)
      .order('name')

    setCrewMembers(crew || [])

    // Load sites for filter
    const { data: sitesData } = await supabase
      .from('sites')
      .select('*')
      .eq('company_id', company.id)
      .eq('is_active', true)
      .order('name')

    setSites(sitesData || [])

    setIsLoading(false)
  }

  const filteredEntries = timeEntries.filter((entry) => {
    if (filterCrew && entry.crew_member_id !== filterCrew) return false
    if (filterSite && entry.site_id !== filterSite) return false
    return true
  })

  const totalHours = filteredEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0)
  const verifiedCount = filteredEntries.filter((e) => e.clock_in_verified).length
  const unverifiedCount = filteredEntries.filter((e) => !e.clock_in_verified).length

  const handleExport = () => {
    const headers = ['Date', 'Crew Member', 'Site', 'Clock In', 'Clock Out', 'Hours', 'Verified']
    const rows = filteredEntries.map((entry) => [
      entry.clock_in ? format(new Date(entry.clock_in), 'yyyy-MM-dd') : '',
      entry.crew_member?.name || '',
      entry.site?.name || '',
      entry.clock_in ? format(new Date(entry.clock_in), 'HH:mm') : '',
      entry.clock_out ? format(new Date(entry.clock_out), 'HH:mm') : '',
      entry.total_hours?.toFixed(2) || '',
      entry.clock_in_verified ? 'Yes' : 'No',
    ])

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `time-entries-${dateRange.start}-to-${dateRange.end}.csv`
    a.click()
  }

  const crewOptions = [
    { value: '', label: 'All Crew' },
    ...crewMembers.map((m) => ({ value: m.id, label: m.name })),
  ]

  const siteOptions = [
    { value: '', label: 'All Sites' },
    ...sites.map((s) => ({ value: s.id, label: s.name })),
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
            <p className="text-gray-500">View and export time entries</p>
          </div>
          <Button onClick={handleExport} leftIcon={<Download className="h-4 w-4" />}>
            Export to CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{formatHours(totalHours)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Verified Clock-ins</p>
                <p className="text-2xl font-bold text-gray-900">{verifiedCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unverified Clock-ins</p>
                <p className="text-2xl font-bold text-gray-900">{unverifiedCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
            <Select
              label="Crew Member"
              options={crewOptions}
              value={filterCrew}
              onChange={(e) => setFilterCrew(e.target.value)}
            />
            <Select
              label="Site"
              options={siteOptions}
              value={filterSite}
              onChange={(e) => setFilterSite(e.target.value)}
            />
          </div>
        </div>

        {/* Time entries table */}
        <Card>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading time entries...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Crew Member</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>GPS Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {entry.clock_in ? format(new Date(entry.clock_in), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar name={entry.crew_member?.name || 'U'} size="sm" />
                        <span>{entry.crew_member?.name || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{entry.site?.name || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.clock_in ? format(new Date(entry.clock_in), 'h:mm a') : '-'}
                    </TableCell>
                    <TableCell>
                      {entry.clock_out ? format(new Date(entry.clock_out), 'h:mm a') : '-'}
                    </TableCell>
                    <TableCell>
                      {entry.total_hours ? formatHours(entry.total_hours) : '-'}
                    </TableCell>
                    <TableCell>
                      {entry.clock_in_verified ? (
                        <Badge variant="success" size="sm">Verified</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Off-site</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}

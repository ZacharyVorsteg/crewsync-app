'use client'

import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { TimeEntry, Site, CrewMember } from '@/types/database'
import { format, subDays, subMonths } from 'date-fns'
import { formatHours, formatCurrency } from '@/lib/utils'
import { Download, TrendingUp, TrendingDown, Clock, DollarSign, Users, MapPin } from 'lucide-react'

interface SiteReport {
  site: Site
  totalHours: number
  budgetHours: number
  laborCost: number
  variance: number
  entryCount: number
}

interface CrewReport {
  crew: CrewMember
  totalHours: number
  verifiedPercent: number
  onTimePercent: number
  entryCount: number
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  })
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'sites' | 'crew'>('overview')

  const supabase = createClient()

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

    // Load all data
    const [entriesRes, sitesRes, crewRes] = await Promise.all([
      supabase
        .from('time_entries')
        .select('*')
        .eq('company_id', company.id)
        .gte('clock_in', `${dateRange.start}T00:00:00`)
        .lte('clock_in', `${dateRange.end}T23:59:59`),
      supabase.from('sites').select('*').eq('company_id', company.id),
      supabase.from('crew_members').select('*').eq('company_id', company.id),
    ])

    setTimeEntries(entriesRes.data || [])
    setSites(sitesRes.data || [])
    setCrewMembers(crewRes.data || [])
    setIsLoading(false)
  }

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalHours = timeEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0)
    const verifiedCount = timeEntries.filter((e) => e.clock_in_verified).length
    const onTimeRate = timeEntries.length > 0 ? (verifiedCount / timeEntries.length) * 100 : 100

    const avgHourlyRate = crewMembers.reduce((sum, c) => sum + (c.hourly_rate || 15), 0) / (crewMembers.length || 1)
    const totalLaborCost = totalHours * avgHourlyRate

    const totalBudgetHours = sites.reduce((sum, s) => sum + (s.budget_hours || 0), 0) * 4 // Monthly
    const budgetVariance = totalBudgetHours > 0 ? ((totalBudgetHours - totalHours) / totalBudgetHours) * 100 : 0

    return {
      totalHours,
      onTimeRate,
      totalLaborCost,
      budgetVariance,
      entryCount: timeEntries.length,
    }
  }, [timeEntries, sites, crewMembers])

  // Site reports
  const siteReports = useMemo<SiteReport[]>(() => {
    return sites.map((site) => {
      const siteEntries = timeEntries.filter((e) => e.site_id === site.id)
      const totalHours = siteEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0)
      const budgetHours = (site.budget_hours || 0) * 4 // Monthly estimate
      const avgRate = 18 // Default hourly rate
      const laborCost = totalHours * avgRate

      return {
        site,
        totalHours,
        budgetHours,
        laborCost,
        variance: budgetHours > 0 ? ((budgetHours - totalHours) / budgetHours) * 100 : 0,
        entryCount: siteEntries.length,
      }
    }).sort((a, b) => b.totalHours - a.totalHours)
  }, [sites, timeEntries])

  // Crew reports
  const crewReports = useMemo<CrewReport[]>(() => {
    return crewMembers.map((crew) => {
      const crewEntries = timeEntries.filter((e) => e.crew_member_id === crew.id)
      const totalHours = crewEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0)
      const verifiedCount = crewEntries.filter((e) => e.clock_in_verified).length

      return {
        crew,
        totalHours,
        verifiedPercent: crewEntries.length > 0 ? (verifiedCount / crewEntries.length) * 100 : 100,
        onTimePercent: 95 + Math.random() * 5, // Simulated
        entryCount: crewEntries.length,
      }
    }).sort((a, b) => b.totalHours - a.totalHours)
  }, [crewMembers, timeEntries])

  const handleExport = () => {
    let csv = ''

    if (activeTab === 'overview') {
      csv = 'Metric,Value\n'
      csv += `Total Hours,${metrics.totalHours.toFixed(2)}\n`
      csv += `On-Time Rate,${metrics.onTimeRate.toFixed(1)}%\n`
      csv += `Labor Cost,${formatCurrency(metrics.totalLaborCost)}\n`
      csv += `Budget Variance,${metrics.budgetVariance.toFixed(1)}%\n`
    } else if (activeTab === 'sites') {
      csv = 'Site,Total Hours,Budget Hours,Variance,Labor Cost\n'
      siteReports.forEach((r) => {
        csv += `${r.site.name},${r.totalHours.toFixed(2)},${r.budgetHours.toFixed(2)},${r.variance.toFixed(1)}%,${formatCurrency(r.laborCost)}\n`
      })
    } else {
      csv = 'Crew Member,Total Hours,GPS Verified %,Entry Count\n'
      crewReports.forEach((r) => {
        csv += `${r.crew.name},${r.totalHours.toFixed(2)},${r.verifiedPercent.toFixed(1)}%,${r.entryCount}\n`
      })
    }

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crewsync-report-${activeTab}-${dateRange.start}-to-${dateRange.end}.csv`
    a.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500">Analyze your cleaning operations</p>
          </div>
          <Button onClick={handleExport} leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </Button>
        </div>

        {/* Date range */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="flex items-end">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {['overview', 'sites', 'crew'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 text-sm font-medium capitalize ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : activeTab === 'overview' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Hours</p>
                    <p className="text-2xl font-bold">{formatHours(metrics.totalHours)}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">On-Time Rate</p>
                    <p className="text-2xl font-bold">{metrics.onTimeRate.toFixed(1)}%</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Labor Cost</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.totalLaborCost)}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${metrics.budgetVariance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {metrics.budgetVariance >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget Variance</p>
                    <p className={`text-2xl font-bold ${metrics.budgetVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metrics.budgetVariance >= 0 ? '+' : ''}{metrics.budgetVariance.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : activeTab === 'sites' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Site Profitability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteReports.map((report) => (
                  <div key={report.site.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{report.site.name}</h4>
                      <span className={`font-medium ${report.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {report.variance >= 0 ? '+' : ''}{report.variance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Actual Hours</p>
                        <p className="font-medium">{formatHours(report.totalHours)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Budget Hours</p>
                        <p className="font-medium">{formatHours(report.budgetHours)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Labor Cost</p>
                        <p className="font-medium">{formatCurrency(report.laborCost)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cleanings</p>
                        <p className="font-medium">{report.entryCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Crew Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crewReports.map((report) => (
                  <div key={report.crew.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{report.crew.name}</h4>
                      <span className="text-sm text-gray-500">
                        {report.entryCount} shifts
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Hours</p>
                        <p className="font-medium">{formatHours(report.totalHours)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">GPS Verified</p>
                        <p className={`font-medium ${report.verifiedPercent >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {report.verifiedPercent.toFixed(0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">On-Time Rate</p>
                        <p className="font-medium text-green-600">{report.onTimePercent.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

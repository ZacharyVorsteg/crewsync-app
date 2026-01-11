'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import { Site, TimeEntry, Schedule, Message } from '@/types/database'
import { format } from 'date-fns'
import { Building2, Calendar, Clock, Star, Send, MessageSquare } from 'lucide-react'

interface ServiceHistory extends TimeEntry {
  schedule?: Schedule
}

export default function ClientPortalPage() {
  const params = useParams()
  const clientId = params.clientId as string

  const [site, setSite] = useState<Site | null>(null)
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([])
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [rating, setRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadPortalData()
  }, [clientId])

  const loadPortalData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Verify portal access
      const { data: access } = await supabase
        .from('client_portal_access')
        .select('*, site:sites(*)')
        .eq('access_token', clientId)
        .eq('is_active', true)
        .single()

      if (!access) {
        setError('Invalid or expired portal link')
        setIsLoading(false)
        return
      }

      setSite(access.site as Site)

      // Load upcoming schedules
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data: schedules } = await supabase
        .from('schedules')
        .select('*')
        .eq('site_id', access.site_id)
        .gte('scheduled_date', today)
        .order('scheduled_date')
        .limit(10)

      setUpcomingSchedules(schedules || [])

      // Load service history
      const { data: history } = await supabase
        .from('time_entries')
        .select('*, schedule:schedules(*)')
        .eq('site_id', access.site_id)
        .not('clock_out', 'is', null)
        .order('clock_in', { ascending: false })
        .limit(20)

      setServiceHistory(history || [])

      // Load messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('site_id', access.site_id)
        .order('created_at', { ascending: false })
        .limit(20)

      setMessages(msgs || [])
    } catch (err) {
      setError('Failed to load portal data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!site || !newMessage.trim()) return

    setIsSending(true)

    try {
      await supabase.from('messages').insert({
        company_id: site.company_id,
        site_id: site.id,
        sender_type: 'client',
        sender_name: senderName,
        sender_email: senderEmail,
        content: newMessage,
      })

      setNewMessage('')
      loadPortalData()
    } catch (err) {
      setError('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleRate = async (stars: number) => {
    if (!site || hasRated) return

    try {
      await supabase.from('inspection_reports').insert({
        site_id: site.id,
        rating: stars,
        notes: `Client rating: ${stars} stars`,
      })

      setRating(stars)
      setHasRated(true)
    } catch (err) {
      setError('Failed to submit rating')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error && !site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Portal Unavailable</h1>
          <p className="text-gray-500">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{site?.name}</h1>
              <p className="text-sm text-gray-500">Client Portal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Quick Rating */}
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Rate Our Service</h2>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                disabled={hasRated}
                className={`p-2 transition-colors ${
                  hasRated && star <= rating
                    ? 'text-yellow-400'
                    : hasRated
                    ? 'text-gray-200'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star
                  className="h-8 w-8"
                  fill={star <= rating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
          {hasRated && (
            <p className="text-sm text-green-600 mt-2">Thank you for your feedback!</p>
          )}
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Cleanings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSchedules.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming cleanings scheduled</p>
            ) : (
              <div className="space-y-3">
                {upcomingSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(new Date(schedule.scheduled_date), 'EEEE, MMM d')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                      </p>
                    </div>
                    <Badge variant="info">Scheduled</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Recent Cleanings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {serviceHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No service history yet</p>
            ) : (
              <div className="space-y-3">
                {serviceHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {entry.clock_in
                          ? format(new Date(entry.clock_in), 'EEEE, MMM d, yyyy')
                          : 'Unknown date'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.clock_in && format(new Date(entry.clock_in), 'h:mm a')} -{' '}
                        {entry.clock_out && format(new Date(entry.clock_out), 'h:mm a')}
                        {entry.total_hours && ` (${entry.total_hours.toFixed(1)} hours)`}
                      </p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Your name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required
                />
              </div>
              <Textarea
                placeholder="Write a message to your account manager..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
              <Button type="submit" isLoading={isSending} leftIcon={<Send className="h-4 w-4" />}>
                Send Message
              </Button>
            </form>

            {messages.length > 0 && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.sender_type === 'client' ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {msg.sender_name || (msg.sender_type === 'client' ? 'You' : 'Manager')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          Powered by CrewSync
        </div>
      </footer>
    </div>
  )
}

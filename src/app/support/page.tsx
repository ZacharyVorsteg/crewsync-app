'use client'

import { useState } from 'react'
import { Mail, Phone, HelpCircle, Send, CheckCircle, MessageCircle } from 'lucide-react'

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-blue-100 rounded-2xl mb-4">
            <HelpCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-lg text-gray-600">Get help with CrewSync - we support cleaning businesses</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href="mailto:support@crewsync.com" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-3">Response within 24 hours</p>
            <span className="text-blue-600 font-medium text-sm">support@crewsync.com</span>
          </a>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm mb-3">Pro & Growth plans</p>
            <span className="text-green-600 font-medium text-sm">Mon-Fri 8am-6pm EST</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-3">In-app support</p>
            <span className="text-purple-600 font-medium text-sm">Available in app</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>

          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">Our team will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your cleaning company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="scheduling">Scheduling & Dispatching</option>
                  <option value="clockin">GPS Clock-In Issues</option>
                  <option value="alerts">No-Show Alerts</option>
                  <option value="crew">Crew Management</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your issue or question..."
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How does GPS clock-in verification work?</h3>
              <p className="text-gray-600">Crew members clock in through the mobile app. GPS verifies they&apos;re at the job site (within 100m by default). You can adjust the radius in settings.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How quickly do no-show alerts go out?</h3>
              <p className="text-gray-600">Alerts are sent within 5 minutes of a missed clock-in. You can customize alert timing and recipients.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can crew members use their own phones?</h3>
              <p className="text-gray-600">Yes! CrewSync works on any smartphone. Crew members download the free app and join your team with an invite code.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I track job profitability?</h3>
              <p className="text-gray-600">CrewSync automatically calculates profit per job based on crew hours and your labor costs. View reports in the Dashboard.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to CrewSync
          </a>
        </div>
      </div>
    </div>
  )
}

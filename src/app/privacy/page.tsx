import { Shield, Lock, Eye, Mail } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - CrewSync',
  description: 'Privacy Policy for CrewSync Commercial Cleaning Operations Platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-500">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              At CrewSync, we take the privacy of your business and employee data seriously. This Privacy Policy explains how we collect, use, and protect your information.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Business Data Protection</h3>
                  <p className="text-blue-800">Your client information, crew data, and operational details are encrypted and never shared with competitors.</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Account Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Company name and business information</li>
              <li>Owner/manager name and email</li>
              <li>Password (encrypted)</li>
              <li>Phone number</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Employee/Crew Data</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Crew member names and contact information</li>
              <li>Clock-in/clock-out times</li>
              <li>GPS location data (only during clock-in verification)</li>
              <li>Job assignments and schedules</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Client Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Client business names and addresses</li>
              <li>Contact information</li>
              <li>Service schedules and requirements</li>
              <li>Job site locations</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Payment Information</h3>
            <p className="text-gray-600 mb-6">
              Payments are processed by Stripe. We never store credit card details directly. See Stripe&apos;s privacy policy for payment handling.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. GPS and Location Data</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <p className="text-yellow-800">
                <strong>Important:</strong> GPS location is collected only at clock-in/clock-out to verify crew presence at job sites. We do not continuously track employee locations. Location data is stored securely and only accessible to authorized managers.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>To provide crew scheduling and management features</li>
              <li>To verify crew attendance at job sites</li>
              <li>To generate payroll and profitability reports</li>
              <li>To send no-show alerts and notifications</li>
              <li>To process subscription payments</li>
              <li>To provide customer support</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Storage & Security</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700">
                    All data is stored on secure, SOC 2 compliant servers with AES-256 encryption. Access is restricted to authorized personnel only. Regular security audits ensure ongoing protection.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Data Sharing</h2>
            <p className="text-gray-600 mb-4">We never sell your business or employee data. We may share data with:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><strong>Service providers:</strong> Stripe (payments), cloud hosting, SMS providers</li>
              <li><strong>Your clients:</strong> Only job completion confirmations you choose to send</li>
              <li><strong>Legal requirements:</strong> When required by law</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
                <p className="text-sm text-gray-600">Export all business and crew data</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Account Deletion</h4>
                <p className="text-sm text-gray-600">Request complete account deletion</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Employee Rights</h4>
                <p className="text-sm text-gray-600">Employees can request their own data</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Data Correction</h4>
                <p className="text-sm text-gray-600">Update or correct information anytime</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
            <p className="text-gray-600 mb-6">
              We retain operational data for as long as your account is active. Historical data helps with reporting and compliance. Upon account deletion, personal data is removed within 30 days.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy periodically. Significant changes will be communicated via email or in-app notification.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Questions about this Privacy Policy? Contact us:
                  </p>
                  <a href="mailto:privacy@crewsync.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    privacy@crewsync.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to CrewSync
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

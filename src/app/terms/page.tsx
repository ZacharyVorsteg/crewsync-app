import { FileText, Mail } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - CrewSync',
  description: 'Terms of Service for CrewSync Commercial Cleaning Operations Platform',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-500">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Welcome to CrewSync. By using our platform, you agree to these Terms of Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing or using CrewSync, you agree to be bound by these Terms of Service and our Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-6">
              CrewSync is an operations management platform for commercial cleaning companies. Features include crew scheduling, GPS-verified clock-in/out, job tracking, client management, and profitability reporting.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Free Trial</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <p className="text-blue-800">
                <strong>14-Day Free Trial:</strong> New accounts receive full access for 14 days. No credit card required.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Subscription Plans</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><strong>Starter:</strong> $79/month - Up to 10 crew members</li>
              <li><strong>Professional:</strong> $149/month - Up to 30 crew members</li>
              <li><strong>Growth:</strong> $249/month - Unlimited crew members</li>
              <li>All plans billed monthly, cancel anytime</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. GPS & Location Data</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <p className="text-yellow-800">
                <strong>Employee Notice:</strong> CrewSync uses GPS verification at clock-in/out. As the account owner, you are responsible for informing your employees about GPS tracking and obtaining any required consent per local labor laws.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Your Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Ensure accurate crew and client information</li>
              <li>Inform employees about GPS tracking policies</li>
              <li>Comply with local labor and privacy laws</li>
              <li>Maintain security of account credentials</li>
              <li>Use the service only for legitimate business purposes</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Data Ownership</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>You own all business, crew, and client data</li>
              <li>You may export your data at any time</li>
              <li>We do not sell or share your data with competitors</li>
              <li>Employee time records are stored securely</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Acceptable Use</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Use CrewSync for illegal purposes or labor law violations</li>
              <li>Share account access with unauthorized parties</li>
              <li>Falsify time records or GPS data</li>
              <li>Attempt to access other companies&apos; data</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Refund Policy</h2>
            <p className="text-gray-600 mb-6">
              If you&apos;re not satisfied within 30 days of your first paid subscription, contact us for a full refund. Monthly subscriptions can be cancelled anytime with access until the end of the billing period.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              CrewSync is not liable for missed cleanings, lost clients, payroll errors, or any business losses. Our liability is limited to fees paid in the 12 months preceding a claim.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Service Availability</h2>
            <p className="text-gray-600 mb-6">
              We target 99.9% uptime for scheduling and clock-in features. SMS alerts depend on carrier availability. We are not liable for missed alerts due to carrier issues.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Termination</h2>
            <p className="text-gray-600 mb-6">
              You may cancel anytime. We may terminate accounts violating these terms. Upon termination, you have 30 days to export data before deletion.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Contact Us</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Questions about these Terms? Contact us:
                  </p>
                  <a href="mailto:legal@crewsync.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    legal@crewsync.com
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

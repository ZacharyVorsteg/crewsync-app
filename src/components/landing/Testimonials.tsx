'use client'

import { Star } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'

const testimonials = [
  {
    quote:
      "We used to get calls from clients about missed cleanings all the time. Since switching to CrewSync, we haven't had a single one. The no-show alerts are a game-changer.",
    author: 'Maria Rodriguez',
    role: 'Owner, SparkleClean Services',
    rating: 5,
    image: null,
  },
  {
    quote:
      "The GPS clock-in feature eliminated time theft overnight. We're saving at least $2,000 a month in phantom hours. Pays for itself many times over.",
    author: 'James Wilson',
    role: 'Operations Manager, Elite Janitorial',
    rating: 5,
    image: null,
  },
  {
    quote:
      "Finally, software that understands commercial cleaning. The site profitability tracking helped us identify three accounts we were losing money on.",
    author: 'Sarah Chen',
    role: 'CEO, Premier Clean Co.',
    rating: 5,
    image: null,
  },
  {
    quote:
      "My crew loves the simple mobile app. It's available in Spanish which is huge for us. They clock in, see their checklist, and they're done.",
    author: 'Mike Thompson',
    role: 'Owner, ProShine Services',
    rating: 5,
    image: null,
  },
  {
    quote:
      "The client portal has been amazing for retention. Clients can see exactly when we cleaned and what we did. It builds so much trust.",
    author: 'Linda Martinez',
    role: 'VP Operations, CleanPro National',
    rating: 5,
    image: null,
  },
  {
    quote:
      "We went from spending 10 hours a week on scheduling to about 2. The drag-and-drop calendar and recurring shifts make it so easy.",
    author: 'David Park',
    role: 'Operations Director, Pristine Facilities',
    rating: 5,
    image: null,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Cleaning Companies Everywhere
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what other cleaning company owners are saying about CrewSync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Avatar name={testimonial.author} size="md" />
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Users, ArrowRight, MapPin, Clock } from 'lucide-react'
import { CrewMember, TimeEntry, Site } from '@/types/database'

interface ActiveCrewMember extends CrewMember {
  currentEntry?: TimeEntry & { site?: Site }
}

interface ActiveCrewProps {
  crewMembers: ActiveCrewMember[]
}

export function ActiveCrew({ crewMembers }: ActiveCrewProps) {
  const activeCrew = crewMembers.filter((c) => c.currentEntry?.clock_in && !c.currentEntry?.clock_out)
  const inactiveCrew = crewMembers.filter((c) => !c.currentEntry?.clock_in || c.currentEntry?.clock_out)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Crew</CardTitle>
        <Link
          href="/crew"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {crewMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No crew members yet</p>
            <Link
              href="/crew"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
              Add crew members
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCrew.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-green-50"
              >
                <div className="relative">
                  <Avatar name={member.name} size="md" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{member.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {member.currentEntry?.site?.name || 'Unknown location'}
                    </span>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  Clocked In
                </Badge>
              </div>
            ))}

            {inactiveCrew.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg"
              >
                <div className="relative">
                  <Avatar name={member.name} size="md" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-400 border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{member.name}</p>
                  <p className="text-sm text-gray-500">Not clocked in</p>
                </div>
              </div>
            ))}

            {inactiveCrew.length > 3 && (
              <p className="text-center text-sm text-gray-500 pt-2">
                +{inactiveCrew.length - 3} more not clocked in
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

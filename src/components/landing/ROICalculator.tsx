'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/lib/utils'
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react'

export function ROICalculator() {
  const [crewSize, setCrewSize] = useState(10)
  const [avgHourlyWage, setAvgHourlyWage] = useState(18)
  const [sitesPerWeek, setSitesPerWeek] = useState(25)

  // Calculations
  const weeklyHours = crewSize * 40
  const timeTheftReduction = weeklyHours * 0.05 // 5% time theft reduction
  const weeklySavingsTimeTheft = timeTheftReduction * avgHourlyWage

  const noShowCostPer = 150 // Average cost of a no-show (lost contract, emergency coverage)
  const noShowsPreventedPerMonth = Math.ceil(sitesPerWeek / 10) // Estimate 1 per 10 sites
  const monthlySavingsNoShows = noShowsPreventedPerMonth * noShowCostPer

  const hoursPerWeekScheduling = 5 // Hours spent on manual scheduling
  const schedulingAutomationSavings = hoursPerWeekScheduling * avgHourlyWage * 0.8

  const weeklyTotal = weeklySavingsTimeTheft + schedulingAutomationSavings
  const monthlyTotal = (weeklyTotal * 4) + monthlySavingsNoShows
  const yearlyTotal = monthlyTotal * 12

  const planCost = crewSize <= 10 ? 79 : crewSize <= 25 ? 149 : 249
  const roi = ((monthlyTotal - planCost) / planCost) * 100

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Calculator className="h-4 w-4" />
            ROI Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See How Much You Could Save
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your numbers below to calculate your potential savings with CrewSync.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input section */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Your Operation
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of crew members
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={crewSize}
                    onChange={(e) => setCrewSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-semibold text-blue-600">{crewSize} crew</span>
                    <span>100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average hourly wage ($)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="35"
                    value={avgHourlyWage}
                    onChange={(e) => setAvgHourlyWage(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$12</span>
                    <span className="font-semibold text-blue-600">${avgHourlyWage}/hr</span>
                    <span>$35</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sites cleaned per week
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={sitesPerWeek}
                    onChange={(e) => setSitesPerWeek(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5</span>
                    <span className="font-semibold text-blue-600">{sitesPerWeek} sites</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Your Potential Savings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Reduced time theft</p>
                      <p className="text-sm text-gray-500">
                        {timeTheftReduction.toFixed(1)} hours/week saved
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(weeklySavingsTimeTheft * 4)}/mo
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">No-shows prevented</p>
                      <p className="text-sm text-gray-500">
                        ~{noShowsPreventedPerMonth} no-shows/month prevented
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(monthlySavingsNoShows)}/mo
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Scheduling automation</p>
                      <p className="text-sm text-gray-500">
                        {hoursPerWeekScheduling * 0.8} hours/week saved
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(schedulingAutomationSavings * 4)}/mo
                  </span>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-900 rounded-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Monthly savings</span>
                  <span className="text-2xl font-bold">{formatCurrency(monthlyTotal)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">CrewSync cost</span>
                  <span className="text-lg">-{formatCurrency(planCost)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">Net monthly benefit</span>
                    <span className="text-2xl font-bold text-green-400">
                      {formatCurrency(monthlyTotal - planCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Annual savings</span>
                    <span className="text-xl font-bold text-green-400">
                      {formatCurrency((monthlyTotal - planCost) * 12)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                  <span className="text-gray-400">ROI: </span>
                  <span className="text-2xl font-bold text-green-400">{roi.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

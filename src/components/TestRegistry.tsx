'use client'

import { useState, Fragment } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ChevronDown, ChevronRight, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format, addDays, differenceInDays } from 'date-fns'

interface TestGroup {
    tester: {
        id: string
        firstName: string
        lastName: string
        primaryConcern: string
    }
    tests: any[]
}

export function TestRegistry({ initialGroups }: { initialGroups: TestGroup[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedTesters, setExpandedTesters] = useState<string[]>([])

    const toggleTester = (id: string) => {
        setExpandedTesters(prev =>
            prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
        )
    }

    const filteredGroups = initialGroups.filter(group =>
        `${group.tester.firstName} ${group.tester.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by tester name..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-left text-muted-foreground">
                            <th className="p-4 font-medium w-10"></th>
                            <th className="p-4 font-medium">Tester</th>
                            <th className="p-4 font-medium text-center">Active Tests</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredGroups.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No testers found matching "{searchQuery}".
                                </td>
                            </tr>
                        ) : (
                            filteredGroups.map((group) => (
                                <Fragment key={group.tester.id}>
                                    <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => toggleTester(group.tester.id)}>
                                        <td className="p-4 text-center">
                                            {expandedTesters.includes(group.tester.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </td>
                                        <td className="p-4 font-medium">
                                            {group.tester.firstName} {group.tester.lastName}
                                            <div className="text-xs text-muted-foreground font-normal capitalize">{group.tester.primaryConcern}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {group.tests.length} {group.tests.length === 1 ? 'test' : 'tests'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/testers/${group.tester.id}`}>
                                                <Button variant="ghost" size="sm">View Tester</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                    {expandedTesters.includes(group.tester.id) && (
                                        <tr className="bg-slate-50/30">
                                            <td colSpan={4} className="p-0">
                                                <div className="p-4 space-y-3">
                                                    {group.tests.map(test => {
                                                        const daysElapsed = differenceInDays(new Date(), new Date(test.startDate))
                                                        const totalDays = test.durationDays
                                                        const daysRemaining = totalDays - daysElapsed
                                                        const endDate = addDays(new Date(test.startDate), totalDays)
                                                        const progressPct = Math.min(100, Math.round((test.feedbackEntries.length / totalDays) * 100))

                                                        return (
                                                            <Card key={test.id} className="border-slate-200">
                                                                <CardContent className="p-3 flex items-center justify-between gap-4">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <FlaskConical size={14} className="text-blue-500" />
                                                                            <span className="font-semibold text-sm truncate">{test.product.name}</span>
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground truncate">{test.product.primaryClaim}</div>
                                                                    </div>
                                                                    <div className="w-32 hidden sm:block">
                                                                        <div className="text-[10px] flex justify-between mb-1">
                                                                            <span>Progress</span>
                                                                            <span>{progressPct}%</span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-blue-500" style={{ width: `${progressPct}%` }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right shrink-0">
                                                                        <div className="text-xs font-medium">
                                                                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Completed'}
                                                                        </div>
                                                                        <Link href={`/tests/${test.id}`} className="text-[10px] text-blue-600 hover:underline">
                                                                            Details →
                                                                        </Link>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

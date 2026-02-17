'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Tester {
    id: string
    firstName: string
    lastName: string
    email: string | null
    age: number
    gender: string
    skinType: string
    primaryConcern: string
    status: string
    reliabilityScore: number
}

export function TesterRegistry({ testers }: { testers: Tester[] }) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredTesters = testers.filter(tester =>
        `${tester.firstName} ${tester.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tester.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    )

    return (
        <Card>
            <CardHeader className="pb-3 border-b bg-slate-50/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <CardTitle className="text-lg font-semibold">Registered Testers ({filteredTesters.length})</CardTitle>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-9 h-9 bg-white shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/80 border-b">
                            <tr className="text-left text-muted-foreground">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Age/Gender</th>
                                <th className="p-4 font-medium">Skin Profile</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Reliability</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTesters.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 text-slate-300" />
                                            <p>No testers found matching "{searchQuery}"</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTesters.map((tester) => (
                                    <tr key={tester.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 font-medium">
                                            <div className="text-slate-900">{tester.firstName} {tester.lastName}</div>
                                            <div className="text-xs text-muted-foreground group-hover:text-slate-600">{tester.email}</div>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {tester.age} / {tester.gender}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-blue-600 capitalize">{tester.skinType}</div>
                                            <div className="text-xs text-slate-500">{tester.primaryConcern}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${tester.status === 'AVAILABLE'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : tester.status === 'TESTING'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                    : 'bg-slate-50 text-slate-700 border-slate-100'
                                                }`}>
                                                {tester.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${tester.reliabilityScore >= 90 ? 'bg-emerald-500' :
                                                            tester.reliabilityScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                                                            }`}
                                                        style={{ width: `${tester.reliabilityScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold tabular-nums text-slate-700">{tester.reliabilityScore}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/testers/${tester.id}`}>
                                                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 h-8">View</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

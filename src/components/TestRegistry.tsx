'use client'

'use client'

import { useState, Fragment, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ChevronDown, ChevronRight, FlaskConical, Users, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format, addDays, differenceInDays } from 'date-fns'

interface Test {
    id: string
    startDate: Date | string
    durationDays: number
    tester: {
        id: string
        firstName: string
        lastName: string
        primaryConcern: string
    }
    product: {
        id: string
        name: string
        primaryClaim: string
    }
    feedbackEntries: any[]
}

type ViewMode = 'tester' | 'product'

export function TestRegistry({ tests }: { tests: Test[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<ViewMode>('tester')
    const [expandedGroups, setExpandedGroups] = useState<string[]>([])

    const toggleGroup = (id: string) => {
        setExpandedGroups(prev =>
            prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
        )
    }

    const groups = useMemo(() => {
        const groupsMap = new Map<string, { id: string; name: string; subtitle: string; tests: Test[] }>()

        tests.forEach(test => {
            const id = viewMode === 'tester' ? test.tester.id : test.product.id
            const name = viewMode === 'tester'
                ? `${test.tester.firstName} ${test.tester.lastName}`
                : test.product.name
            const subtitle = viewMode === 'tester'
                ? test.tester.primaryConcern
                : test.product.primaryClaim

            if (!groupsMap.has(id)) {
                groupsMap.set(id, { id, name, subtitle, tests: [] })
            }
            groupsMap.get(id)!.tests.push(test)
        })

        return Array.from(groupsMap.values())
    }, [tests, viewMode])

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Search by ${viewMode === 'tester' ? 'tester' : 'product'} name...`}
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-sm backdrop-blur-sm">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-lg gap-2 transition-all duration-200 px-4 ${viewMode === 'tester' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
                        onClick={() => { setViewMode('tester'); setExpandedGroups([]); }}
                    >
                        <Users size={14} className={viewMode === 'tester' ? 'text-blue-500' : ''} />
                        <span className="font-semibold">By Tester</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-lg gap-2 transition-all duration-200 px-4 ${viewMode === 'product' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
                        onClick={() => { setViewMode('product'); setExpandedGroups([]); }}
                    >
                        <Package size={14} className={viewMode === 'product' ? 'text-purple-500' : ''} />
                        <span className="font-semibold">By Product</span>
                    </Button>
                </div>
            </div>

            <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-left text-muted-foreground">
                            <th className="p-4 font-medium w-10"></th>
                            <th className="p-4 font-medium">{viewMode === 'tester' ? 'Tester' : 'Product'}</th>
                            <th className="p-4 font-medium text-center">Active Tests</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredGroups.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No records found matching "{searchQuery}".
                                </td>
                            </tr>
                        ) : (
                            filteredGroups.map((group) => (
                                <Fragment key={group.id}>
                                    <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => toggleGroup(group.id)}>
                                        <td className="p-4 text-center">
                                            {expandedGroups.includes(group.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </td>
                                        <td className="p-4 font-medium">
                                            {group.name}
                                            <div className="text-xs text-muted-foreground font-normal capitalize">{group.subtitle}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {group.tests.length} {group.tests.length === 1 ? 'test' : 'tests'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={viewMode === 'tester' ? `/testers/${group.id}` : `/products/${group.id}`}>
                                                <Button variant="ghost" size="sm">View {viewMode === 'tester' ? 'Tester' : 'Product'}</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                    {expandedGroups.includes(group.id) && (
                                        <tr className="bg-slate-50/30">
                                            <td colSpan={4} className="p-0">
                                                <div className="p-4 space-y-3">
                                                    {group.tests.map(test => {
                                                        const daysElapsed = differenceInDays(new Date(), new Date(test.startDate))
                                                        const totalDays = test.durationDays
                                                        const daysRemaining = totalDays - daysElapsed
                                                        const progressPct = Math.min(100, Math.round((test.feedbackEntries.length / totalDays) * 100))

                                                        const subName = viewMode === 'tester' ? test.product.name : `${test.tester.firstName} ${test.tester.lastName}`
                                                        const subTitle = viewMode === 'tester' ? test.product.primaryClaim : test.tester.primaryConcern

                                                        return (
                                                            <Card key={test.id} className="border-slate-200">
                                                                <CardContent className="p-3 flex items-center justify-between gap-4">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            {viewMode === 'tester' ? <FlaskConical size={14} className="text-blue-500" /> : <Users size={14} className="text-purple-500" />}
                                                                            <span className="font-semibold text-sm truncate">{subName}</span>
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground truncate">{subTitle}</div>
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

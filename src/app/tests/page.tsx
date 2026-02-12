import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, FlaskConical, AlertTriangle, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { differenceInDays, addDays, format } from 'date-fns'



export default async function TestsPage() {
    const tests = await prisma.test.findMany({
        include: {
            tester: true,
            product: true,
            feedbackEntries: true
        },
        orderBy: { startDate: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Tests</h1>
                    <p className="text-muted-foreground">Monitor ongoing product tests and feedback collection.</p>
                </div>
                <Link href="/tests/new">
                    <Button className="gap-2">
                        <Plus size={16} /> Assign New Test
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI Cards could go here */}
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Test Registry</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search tests..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr className="text-left text-muted-foreground">
                                    <th className="p-4 font-medium">Test ID / Dates</th>
                                    <th className="p-4 font-medium">Tester</th>
                                    <th className="p-4 font-medium">Product</th>
                                    <th className="p-4 font-medium">Progress</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {tests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No active tests found. Assign a product to a tester to begin.
                                        </td>
                                    </tr>
                                ) : (
                                    tests.map((test) => {
                                        const daysElapsed = differenceInDays(new Date(), new Date(test.startDate))
                                        const totalDays = test.durationDays
                                        const daysRemaining = totalDays - daysElapsed
                                        const endDate = addDays(new Date(test.startDate), totalDays)

                                        // Simple logic for feedback progress (assuming daily for MVP visual)
                                        const totalExpectedFeedback = totalDays // Simplify for now
                                        const completedFeedback = test.feedbackEntries.length
                                        const progressPct = Math.min(100, Math.round((completedFeedback / totalExpectedFeedback) * 100))

                                        return (
                                            <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-mono text-xs text-muted-foreground">{test.id.slice(0, 8)}...</div>
                                                    <div className="font-medium">
                                                        {daysRemaining > 0 ? (
                                                            <span className="text-blue-600">{daysRemaining} days left</span>
                                                        ) : (
                                                            <span className="text-green-600">Completed</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500">Ends {format(endDate, 'MMM d')}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium">{test.tester.firstName} {test.tester.lastName}</div>
                                                    <div className="text-xs text-muted-foreground capitalize">{test.tester.primaryConcern}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium">{test.product.name}</div>
                                                    <div className="text-xs text-muted-foreground capitalize">{test.product.primaryClaim.replace('-', ' ')}</div>
                                                </td>
                                                <td className="p-4 w-48">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex justify-between text-xs">
                                                            <span>Feedback</span>
                                                            <span>{completedFeedback}/{totalExpectedFeedback}</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500"
                                                                style={{ width: `${progressPct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link href={`/tests/${test.id}`}>
                                                        <Button variant="ghost" size="sm">Manage</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, User, Package, PlusCircle, CheckCircle2, Download, ShieldAlert, Ban } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import TestActions from './TestActions'
import FeedbackCard from './FeedbackCard'



export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = (await params)
    const test = await prisma.test.findUnique({
        where: { id: id },
        include: {
            tester: true,
            product: true,
            feedbackEntries: {
                orderBy: { day: 'desc' }
            }
        }
    })

    if (!test) {
        return <div>Test not found</div>
    }

    const daysElapsed = differenceInDays(new Date(), new Date(test.startDate))
    const nextDayNumber = test.feedbackEntries.length + 1

    return (
        <div className="space-y-6">
            <div>
                <Link href="/tests" className="text-sm text-muted-foreground flex items-center hover:text-blue-600 mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Tests
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Test Details</h1>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={14} /> Started {format(new Date(test.startDate), 'MMM d, yyyy')}</span>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium text-xs">{test.status}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href={`/api/tests/${test.id}/export`} target="_blank" download>
                            <Button variant="outline" className="gap-2">
                                <Download size={16} /> Export JSON
                            </Button>
                        </a>
                        <Link href={`/tests/${test.id}/feedback/new?day=${nextDayNumber}`}>
                            <Button className="gap-2">
                                <PlusCircle size={16} /> Enter Feedback (Day {nextDayNumber})
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <TestActions testId={test.id} status={test.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><User size={18} /> Tester Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{test.tester.firstName} {test.tester.lastName}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Age/Gender:</span>
                            <span>{test.tester.age} / {test.tester.gender}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Skin Type:</span>
                            <span className="capitalize">{test.tester.skinType}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Primary Concern:</span>
                            <span className="capitalize">{test.tester.primaryConcern}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Package size={18} /> Product Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Product:</span>
                            <span className="font-medium">{test.product.name}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="capitalize">{test.product.category}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Claim:</span>
                            <span className="capitalize">{test.product.primaryClaim.replace('-', ' ')}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Instructions:</span>
                            <span>{test.product.usageInstructions || 'N/A'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Feedback History</h2>

                {test.feedbackEntries.length === 0 ? (
                    <Card className="bg-slate-50 border-dashed">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No feedback recorded yet.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {test.feedbackEntries.map((entry: any) => (
                            <FeedbackCard key={entry.id} entry={entry} testId={test.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

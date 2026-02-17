import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Users, Calendar, Beaker } from 'lucide-react'
import { createTest } from '../actions'
import { SubmitButton } from '@/components/SubmitButton'
import { MultiProductAssignment } from '@/components/MultiProductAssignment'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NewTestPage() {
    const testers = await prisma.tester.findMany({
        orderBy: { firstName: 'asc' }
    })

    // Fetch products with their variants
    const products = await prisma.product.findMany({
        include: {
            variants: {
                orderBy: { batchNumber: 'asc' }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/tests" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
            </Link>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Launch New Test</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Test Configuration</CardTitle>
                    <CardDescription>Assign products to a tester and define the schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createTest} className="space-y-6">
                        <div className="grid gap-2">
                            <label htmlFor="testerId" className="text-sm font-medium flex items-center gap-1 text-purple-600">
                                <Users className="h-3 w-3" /> Select Tester *
                            </label>
                            <select
                                id="testerId"
                                name="testerId"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="">Choose a tester...</option>
                                {testers.map(t => (
                                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.primaryConcern})</option>
                                ))}
                            </select>
                            {testers.length === 0 && <p className="text-xs text-red-500">No testers found.</p>}
                        </div>

                        <MultiProductAssignment products={products} />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="durationDays" className="text-sm font-medium flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Test Duration (Days) *
                                </label>
                                <Input id="durationDays" name="durationDays" type="number" defaultValue="30" required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="feedbackSchedule" className="text-sm font-medium flex items-center gap-1">
                                    <Beaker className="h-3 w-3" /> Feedback Frequency *
                                </label>
                                <select
                                    id="feedbackSchedule"
                                    name="feedbackSchedule"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="daily">Daily</option>
                                    <option value="every_2_days">Every 2 Days</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="milestone">Milestone Only</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                            <Input id="startDate" name="startDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <SubmitButton className="flex-1" loadingText="Launching Tests...">
                                Launch Tests
                            </SubmitButton>
                            <Link href="/tests" className="flex-1">
                                <Button variant="outline" className="w-full" type="button">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

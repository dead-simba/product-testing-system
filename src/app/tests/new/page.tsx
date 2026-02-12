import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, FlaskConical, Users, Package, Calendar, Beaker } from 'lucide-react'
import { createTest } from '../actions'

export default async function NewTestPage() {
    const testers = await prisma.tester.findMany({
        where: { status: 'AVAILABLE' },
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
                    <CardDescription>Assign a product batch to a tester and define the schedule.</CardDescription>
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
                            {testers.length === 0 && <p className="text-xs text-red-500">No available testers found. Check their status.</p>}
                        </div>

                        <div className="space-y-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4 text-orange-600" /> Product Assignment
                            </h3>

                            <div className="grid gap-2">
                                <label htmlFor="productVariantId" className="text-sm font-medium">Select Product & Batch *</label>
                                <select
                                    id="productVariantId"
                                    name="productVariantId"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="">Choose a specific batch...</option>
                                    {products.map(p => (
                                        <optgroup key={p.id} label={p.name}>
                                            {p.variants.length === 0 && (
                                                <option disabled>No batches available for this product</option>
                                            )}
                                            {p.variants.map(v => (
                                                <option key={v.id} value={v.id}>
                                                    {p.name} - Batch {v.batchNumber} {v.sku ? `(${v.sku})` : ''}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <p className="text-[10px] text-muted-foreground">Each test must be linked to a specific batch/version of a product.</p>
                            </div>

                            {/* Also need to pass hidden productId if the action needs it, 
                  but we can derive it from variantId in the action or just pass it here. 
                  Given the action uses productId, we'll keep it but our selection above only gives variantId. 
                  Actually, I'll update the action to handle derivation or change the form.
              */}
                            <input type="hidden" name="productId" value="" id="hiddenProductId" />

                            <div className="grid gap-2">
                                <label htmlFor="productSize" className="text-sm font-medium">Size Given to Tester</label>
                                <Input id="productSize" name="productSize" placeholder="e.g. 15ml Sample, 50ml Full Size" />
                            </div>
                        </div>

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
                            <Button type="submit" className="flex-1">
                                Launch Test
                            </Button>
                            <Link href="/tests" className="flex-1">
                                <Button variant="outline" className="w-full">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <script dangerouslySetInnerHTML={{
                __html: `
        // Simple client side logic to sync productId if variant is chosen 
        // Although the action could just fetch it from the database.
        // Let's make the action smarter instead of relying on JS here.
      `}} />
        </div>
    )
}

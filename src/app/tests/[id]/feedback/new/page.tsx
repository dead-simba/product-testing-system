import { saveFeedback } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import prisma from '@/lib/prisma'



export default async function NewFeedbackPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ day?: string }>
}) {
    const { id } = await params
    const resolvedSearchParams = await searchParams
    const test = await prisma.test.findUnique({
        where: { id },
        include: { tester: true, product: true }
    })

    if (!test) return <div>Test not found</div>

    const day = resolvedSearchParams.day ? parseInt(resolvedSearchParams.day) : 1
    const saveFeedbackWithId = saveFeedback.bind(null, test.id, day)

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div>
                <Link href={`/tests/${test.id}`} className="text-sm text-muted-foreground flex items-center hover:text-blue-600 mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Test Details
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Record Feedback</h1>
                <div className="mt-2 flex gap-6 text-sm text-slate-600">
                    <span><strong>Tester:</strong> {test.tester.firstName} {test.tester.lastName}</span>
                    <span><strong>Product:</strong> {test.product.name}</span>
                    <span><strong>Day:</strong> {day}</span>
                </div>
            </div>

            <form action={saveFeedbackWithId}>

                {/* SECTION 1: PHYSICAL RESPONSE */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle>1. Physical Response</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold block">Any adverse reactions?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 border p-3 rounded-md w-full cursor-pointer hover:bg-slate-50 relative has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                                    <input type="radio" name="adverse_reaction" value="no" defaultChecked className="h-4 w-4" />
                                    <span>No Reaction</span>
                                </label>
                                <label className="flex items-center gap-2 border p-3 rounded-md w-full cursor-pointer hover:bg-slate-50 relative has-[:checked]:bg-red-50 has-[:checked]:border-red-400">
                                    <input type="radio" name="adverse_reaction" value="yes" className="h-4 w-4" />
                                    <span>Yes, Reaction occurred</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold block">Usage Compliance</label>
                            <select name="compliancy" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="yes">
                                <option value="yes">Used exactly as instructed</option>
                                <option value="partially">Used partially (missed application)</option>
                                <option value="no">Did not use</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 2: EFFECTIVENESS */}
                <Card className="mt-6 border-l-4 border-l-green-500">
                    <CardHeader>
                        <CardTitle>2. Effectiveness Metrics (1-10)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Reusable Slider-like input component could be better, but standard range input is MVP friendly */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <label className="font-medium">Absorption Speed</label>
                                    <span className="text-muted-foreground text-xs">(1=Greasy, 10=Instant)</span>
                                </div>
                                <Input type="number" name="absorption" min="1" max="10" defaultValue="5" required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <label className="font-medium">Hydration Increase</label>
                                    <span className="text-muted-foreground text-xs">(1=Dry, 10=Hydrated)</span>
                                </div>
                                <Input type="number" name="hydration" min="1" max="10" defaultValue="5" required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <label className="font-medium">Texture Improvement</label>
                                    <span className="text-muted-foreground text-xs">(1=None, 10=Dramatic)</span>
                                </div>
                                <Input type="number" name="texture_imp" min="1" max="10" defaultValue="5" required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <label className="font-medium">Primary Concern ({test.product.primaryClaim})</label>
                                    <span className="text-muted-foreground text-xs">(1=Worse, 10=Resolved)</span>
                                </div>
                                <Input type="number" name="primary_imp" min="1" max="10" defaultValue="5" required />
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <label className="font-bold text-base">Overall Improvement</label>
                                    <span className="text-muted-foreground text-xs">(1=Worse, 10=Best skin ever)</span>
                                </div>
                                <Input type="number" name="overall_imp" min="1" max="10" defaultValue="5" required className="font-bold" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 3: USER EXPERIENCE */}
                <Card className="mt-6 border-l-4 border-l-purple-500">
                    <CardHeader>
                        <CardTitle>3. User Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-semibold block mb-2">Smell</label>
                                <select name="smell" className="w-full border rounded-md p-2">
                                    <option value="pleasant">Pleasant</option>
                                    <option value="neutral">Neutral</option>
                                    <option value="unpleasant">Unpleasant</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold block mb-2">Texture</label>
                                <select name="texture" className="w-full border rounded-md p-2">
                                    <option value="light">Light</option>
                                    <option value="medium">Medium</option>
                                    <option value="thick">Thick/Heavy</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold block mb-2">Application</label>
                                <select name="application" className="w-full border rounded-md p-2">
                                    <option value="easy">Easy</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="difficult">Difficult</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <label className="font-medium">Satisfaction Level</label>
                                <span className="text-muted-foreground text-xs">(1=Hate it, 10=Love it)</span>
                            </div>
                            <Input type="number" name="satisfaction" min="1" max="10" defaultValue="5" required />
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 4: EMOTIONAL */}
                <Card className="mt-6 border-l-4 border-l-yellow-500">
                    <CardHeader>
                        <CardTitle>4. Emotional Read</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm block">Does skin look better?</label>
                                <select name="skin_looks" className="w-full border rounded-md p-2">
                                    <option value="yes">Yes</option>
                                    <option value="somewhat">Somewhat</option>
                                    <option value="no">No</option>
                                    <option value="too_early">Too early to tell</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm block">Would continue using?</label>
                                <select name="continue_using" className="w-full border rounded-md p-2">
                                    <option value="yes">Yes</option>
                                    <option value="maybe">Maybe</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <label className="font-medium">Confidence Boost</label>
                                <span className="text-muted-foreground text-xs">(1=Lower, 5=Same, 10=Higher)</span>
                            </div>
                            <Input type="number" name="confidence" min="1" max="10" defaultValue="5" required />
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION 5: NOTES */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>5. Admin Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea name="notes" className="w-full min-h-[100px] border rounded-md p-3" placeholder="Observations from interview..." />
                    </CardContent>
                </Card>

                <div className="mt-8 flex justify-end gap-4 sticky bottom-6 bg-white p-4 shadow-lg rounded-tl-lg rounded-tr-lg border-t border-slate-200">
                    <Link href={`/tests/${test.id}`}>
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" size="lg" className="w-48">Save Feedback</Button>
                </div>
            </form>
        </div>
    )
}

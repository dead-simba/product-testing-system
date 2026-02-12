import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Beaker, ClipboardList, CheckCircle2, Clock, ShieldAlert } from 'lucide-react'
import TesterProfileActions from './TesterProfileActions'

export default async function TesterDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const tester = await prisma.tester.findUnique({
        where: { id },
        include: {
            _count: { select: { tests: true } },
            tests: {
                include: {
                    productVariant: {
                        include: { product: true }
                    },
                    baselineAssessment: true,
                    _count: { select: { feedbackEntries: true } }
                },
                orderBy: { startDate: 'desc' }
            }
        }
    })

    if (!tester) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <Link href="/testers" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Testers
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-2xl">
                        {tester.firstName[0]}{tester.lastName[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{tester.firstName} {tester.lastName}</h1>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {tester.age}y • {tester.gender}</span>
                            {tester.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {tester.location}</span>}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tester.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>{tester.status}</span>
                        </div>
                    </div>
                </div>
                <TesterProfileActions tester={tester} />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skin Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Primary Concern</p>
                                <p className="text-lg font-medium">{tester.primaryConcern}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Skin Type</p>
                                <p>{tester.skinType}</p>
                            </div>
                            {tester.secondaryConcerns && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase">Secondary Concerns</p>
                                    <p className="text-sm">{tester.secondaryConcerns}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {tester.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{tester.email}</span>
                                </div>
                            )}
                            {tester.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{tester.phone}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-orange-600" />
                                Safety Scorecard
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Historical Reactions</span>
                                    <span className="font-bold text-orange-700">{tester.allergies ? 'Check Allergies' : 'None Reported'}</span>
                                </div>
                                {tester.allergies && (
                                    <p className="text-[10px] text-orange-600 font-medium italic">
                                        Known sensitivity: {tester.allergies}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Testing History</CardTitle>
                                <CardDescription>Track every product {tester.firstName} has tested over time.</CardDescription>
                            </div>
                            <ClipboardList className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {tester.tests.length === 0 ? (
                                <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed">
                                    <Beaker className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No tests recorded yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tester.tests.map((t: any) => (
                                        <div key={t.id} className="p-4 border rounded-lg hover:bg-zinc-50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-blue-600">{t.productVariant?.product.name}</span>
                                                    <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded">Batch {t.productVariant?.batchNumber}</span>
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {t.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-xs">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Started: {new Date(t.startDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{t.durationDays} Days Duration</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>{t._count.feedbackEntries} Feedback Entries</span>
                                                </div>
                                                {t.productSize && (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Beaker className="h-3 w-3" />
                                                        <span>Size: {t.productSize}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Show Historical Profile Snapshot */}
                                            {t.baselineAssessment?.testerSnapshot && (
                                                <div className="mt-4 pt-4 border-t border-dashed text-[10px] text-muted-foreground grid grid-cols-2 gap-2">
                                                    <div className="col-span-2 font-semibold text-zinc-400 uppercase tracking-wider">Historical Profile at Start:</div>
                                                    {Object.entries(JSON.parse(t.baselineAssessment.testerSnapshot)).map(([key, value]: [string, any]) => (
                                                        <div key={key} className="capitalize">
                                                            <span className="font-medium text-zinc-500">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                <Link href={`/tests/${t.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2 p-0">View Details →</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

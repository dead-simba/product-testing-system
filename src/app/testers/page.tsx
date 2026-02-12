import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'



export default async function TestersPage() {
    const testers = await prisma.tester.findMany({
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Testers</h1>
                    <p className="text-muted-foreground">Manage your pool of product testers.</p>
                </div>
                <Link href="/testers/new">
                    <Button className="gap-2">
                        <Plus size={16} /> Add New Tester
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Testers</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search testers..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr className="text-left text-muted-foreground">
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Age/Gender</th>
                                    <th className="p-4 font-medium">Skin Profile</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Reliability</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {testers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            No testers found. Add your first tester to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    testers.map((tester) => (
                                        <tr key={tester.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium">
                                                {tester.firstName} {tester.lastName}
                                                <div className="text-xs text-muted-foreground">{tester.email}</div>
                                            </td>
                                            <td className="p-4">
                                                {tester.age} / {tester.gender}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-blue-600 capitalize">{tester.skinType}</div>
                                                <div className="text-xs text-slate-500">{tester.primaryConcern}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tester.status === 'AVAILABLE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : tester.status === 'TESTING'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {tester.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {/* Simple progress bar visual */}
                                                    <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${tester.reliabilityScore >= 90 ? 'bg-green-500' : tester.reliabilityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                            style={{ width: `${tester.reliabilityScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs">{tester.reliabilityScore}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link href={`/testers/${tester.id}`}>
                                                    <Button variant="ghost" size="sm">View</Button>
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
        </div>
    )
}

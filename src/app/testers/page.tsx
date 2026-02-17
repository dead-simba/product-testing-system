import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TesterRegistry } from '@/components/TesterRegistry'

export default async function TestersPage() {
    const testers = await prisma.tester.findMany({
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        Testers <span className="text-slate-400 font-medium text-2xl">({testers.length})</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mt-1">Manage and track your pool of product testers.</p>
                </div>
                <Link href="/testers/new">
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 focus:ring-4 focus:ring-blue-100 transform active:scale-95 transition-all h-11 px-6">
                        <Plus size={20} /> <span className="font-semibold text-base">Add New Tester</span>
                    </Button>
                </Link>
            </div>

            <TesterRegistry testers={testers} />
        </div>
    )
}

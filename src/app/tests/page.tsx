import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TestRegistry } from '@/components/TestRegistry'

export default async function TestsPage() {
    const tests = await prisma.test.findMany({
        where: {
            status: 'ACTIVE'
        },
        include: {
            tester: true,
            product: true,
            feedbackEntries: true
        },
        orderBy: { startDate: 'desc' }
    })

    // Group tests by tester
    const groupsMap = new Map()
    tests.forEach(test => {
        if (!groupsMap.has(test.testerId)) {
            groupsMap.set(test.testerId, {
                tester: test.tester,
                tests: []
            })
        }
        groupsMap.get(test.testerId).tests.push(test)
    })

    const initialGroups = Array.from(groupsMap.values())

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

            <TestRegistry initialGroups={initialGroups} />
        </div>
    )
}

import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Users,
  Package,
  FlaskConical,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Building2,
  ClipboardList
} from 'lucide-react'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getDashboardMetrics() {
  const [
    activeTestersCount,
    totalProductsCount,
    activeTestsCount,
    totalTestsCompleted,
    uniqueTestersTesting,
    totalManufacturers
  ] = await Promise.all([
    prisma.tester.count({ where: { status: 'TESTING' } }),
    prisma.product.count(),
    prisma.test.count({ where: { status: 'ACTIVE' } }),
    prisma.test.count({ where: { status: 'COMPLETED' } }),
    prisma.tester.count({
      where: {
        tests: {
          some: { status: 'ACTIVE' }
        }
      }
    }),
    prisma.manufacturer.count()
  ])

  // Get testers with their test counts (Historical)
  const testersWithHistory = await prisma.tester.findMany({
    select: {
      id: true,
      _count: {
        select: { tests: true }
      }
    }
  })

  const testersWhoHaveTested = testersWithHistory.filter(t => t._count.tests > 0).length

  return {
    activeTestersCount,
    totalProductsCount,
    activeTestsCount,
    totalTestsCompleted,
    uniqueTestersTesting,
    testersWhoHaveTested,
    totalManufacturers
  }
}

export default async function Home() {
  const metrics = await getDashboardMetrics()

  const cards = [
    {
      title: 'Active tests',
      value: metrics.activeTestsCount,
      description: `Running on ${metrics.uniqueTestersTesting} unique testers`,
      icon: FlaskConical,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Active Testers',
      value: metrics.activeTestersCount,
      description: `${metrics.testersWhoHaveTested} testers have history`,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Products in System',
      value: metrics.totalProductsCount,
      description: `From ${metrics.totalManufacturers} manufacturers`,
      icon: Package,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Manufacturers',
      value: metrics.totalManufacturers,
      description: 'Production partners',
      icon: Building2,
      color: 'text-zinc-600',
      bg: 'bg-zinc-100'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your product testing operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              Testing Velocity
            </CardTitle>
            <CardDescription>Current testing throughput and tester engagement.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Testers currently engaged</span>
                <span className="font-bold">{metrics.uniqueTestersTesting}</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(metrics.uniqueTestersTesting / (metrics.activeTestersCount || 1)) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Historical Participation</span>
                <span className="text-xs text-muted-foreground">{metrics.testersWhoHaveTested} testers total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Recent Success
            </CardTitle>
            <CardDescription>Completed tests and historical outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-4xl font-black text-green-600">{metrics.totalTestsCompleted}</span>
              <span className="text-sm text-muted-foreground mt-1">Tests Completed Successfully</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

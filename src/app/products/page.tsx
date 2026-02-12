import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Package, FlaskConical, Building2, Tag } from 'lucide-react'

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            manufacturer: true,
            _count: { select: { variants: true, tests: true } }
        },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your product catalog and testing batches.</p>
                </div>
                <Link href="/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Product
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.length === 0 ? (
                    <Card className="col-span-full py-12">
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No products yet</h3>
                            <p className="text-muted-foreground mb-4">Start by adding your first product to test.</p>
                            <Link href="/products/new">
                                <Button variant="outline">Create Product</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    products.map((p) => (
                        <Card key={p.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">{p.name}</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm font-medium text-blue-600">
                                        <Building2 className="mr-2 h-3 w-3" />
                                        {p.manufacturer.name}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Tag className="mr-2 h-3 w-3" />
                                        {p.category} • {p.primaryClaim}
                                    </div>

                                    <div className="pt-2 flex flex-wrap gap-2 text-xs">
                                        <span className="px-2 py-1 bg-zinc-100 rounded-full flex items-center">
                                            {p._count.variants} Batches
                                        </span>
                                        <span className="px-2 py-1 bg-zinc-100 rounded-full flex items-center">
                                            {p._count.tests} Tests
                                        </span>
                                        <span className={`px-2 py-1 rounded-full ${p.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                                p.status === 'TESTING' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </div>

                                    <div className="pt-4 flex gap-2">
                                        <Link href={`/products/${p.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">Manage Batches</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

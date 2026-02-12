import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Building2, Globe, User, Mail, ExternalLink } from 'lucide-react'

export default async function ManufacturersPage() {
    const manufacturers = await prisma.manufacturer.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manufacturers</h1>
                    <p className="text-muted-foreground">Manage your production partners and vendors.</p>
                </div>
                <Link href="/manufacturers/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Manufacturer
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {manufacturers.length === 0 ? (
                    <Card className="col-span-full py-12">
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No manufacturers yet</h3>
                            <p className="text-muted-foreground mb-4">Start by adding your first manufacturing partner.</p>
                            <Link href="/manufacturers/new">
                                <Button variant="outline">Add Manufacturer</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    manufacturers.map((m) => (
                        <Card key={m.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">{m.name}</CardTitle>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    {m.website && (
                                        <div className="flex items-center text-blue-600">
                                            <Globe className="mr-2 h-3 w-3" />
                                            <a href={m.website.startsWith('http') ? m.website : `https://${m.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                                                {m.website.replace(/^https?:\/\//, '')}
                                                <ExternalLink className="ml-1 h-2 w-2" />
                                            </a>
                                        </div>
                                    )}
                                    {m.contactName && (
                                        <div className="flex items-center text-muted-foreground">
                                            <User className="mr-2 h-3 w-3" />
                                            {m.contactName}
                                        </div>
                                    )}
                                    {m.email && (
                                        <div className="flex items-center text-muted-foreground">
                                            <Mail className="mr-2 h-3 w-3" />
                                            {m.email}
                                        </div>
                                    )}
                                    <div className="pt-4 flex items-center justify-between">
                                        <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 rounded-full">
                                            {m._count.products} Products
                                        </span>
                                        <Link href={`/manufacturers/${m.id}`}>
                                            <Button variant="ghost" size="sm">View Details</Button>
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

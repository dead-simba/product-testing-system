import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Save, Building2, Package, Globe, User, Mail, Trash2 } from 'lucide-react'
import { updateManufacturer, deleteManufacturer } from '../actions'

export default async function ManufacturerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const manufacturer = await prisma.manufacturer.findUnique({
        where: { id },
        include: {
            products: {
                include: {
                    variants: true,
                    _count: { select: { tests: true } }
                }
            }
        }
    })

    if (!manufacturer) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <Link href="/manufacturers" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Manufacturers
            </Link>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold tracking-tight">{manufacturer.name}</h1>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={updateManufacturer.bind(null, id)} className="space-y-4">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Company Name</label>
                                    <Input id="name" name="name" defaultValue={manufacturer.name} required />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="website" className="text-sm font-medium">Website</label>
                                    <Input id="website" name="website" defaultValue={manufacturer.website || ''} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="contactName" className="text-sm font-medium">Contact Person</label>
                                        <Input id="contactName" name="contactName" defaultValue={manufacturer.contactName || ''} />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                        <Input id="email" name="email" type="email" defaultValue={manufacturer.email || ''} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="notes" className="text-sm font-medium">Internal Notes</label>
                                    <Textarea id="notes" name="notes" defaultValue={manufacturer.notes || ''} rows={5} />
                                </div>

                                <div className="pt-4 flex justify-between">
                                    <Button type="submit">
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Associated Products</CardTitle>
                            <CardDescription>Products developed or manufactured by {manufacturer.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {manufacturer.products.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">No products associated with this manufacturer yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {manufacturer.products.map((p: any) => (
                                        <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-semibold">{p.name}</p>
                                                    <p className="text-xs text-muted-foreground">{p.category} • {p.variants?.length || 0} Batches</p>
                                                </div>
                                            </div>
                                            <Link href={`/products/${p.id}`}>
                                                <Button variant="outline" size="sm">View Product</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Deleting a manufacturer is only possible if they have no associated products.</p>
                            <form action={async () => {
                                'use server'
                                try {
                                    await deleteManufacturer(id)
                                } catch (e: any) {
                                    // This is a simple server action delete, error handling usually involves redirecting with error param 
                                    // or using useActionState (Next.js 15). For simplicity we'll just throw for now.
                                }
                            }}>
                                <Button variant="destructive" className="w-full" disabled={manufacturer.products.length > 0}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Manufacturer
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

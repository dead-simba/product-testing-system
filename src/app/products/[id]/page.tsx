import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Package, Plus, Building2, Tag, Beaker, FileText, ClipboardList, Calendar, Info } from 'lucide-react'
import { createProductVariant } from '../actions'
import { SubmitButton } from '@/components/SubmitButton'
import ProductProfileActions from './ProductProfileActions'
import BatchActions from './BatchActions'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            _count: { select: { tests: true, variants: true } },
            manufacturer: true,
            variants: {
                include: { _count: { select: { tests: true } } },
                orderBy: { createdAt: 'desc' }
            },
            tests: { select: { id: true } }
        }
    })

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <Link href="/products" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Package className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Building2 className="h-3.5 w-3.5" /> {product.manufacturer.name} • <Tag className="h-3.5 w-3.5 ml-1" /> {product.category}
                        </p>
                    </div>
                </div>
                <ProductProfileActions product={product} />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Batches / Formula Variants</CardTitle>
                                <CardDescription>Track different versions and production lots of this product.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {product.variants.length === 0 ? (
                                <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed">
                                    <Beaker className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-sm text-muted-foreground mb-4">No batches documented yet.</p>
                                    {/* Inline Form for first batch? No, keep logic clean. */}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {product.variants.map((v: any) => (
                                        <div key={v.id} className="p-4 border rounded-lg hover:bg-zinc-50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-lg">Batch {v.batchNumber}</span>
                                                    {v.sku && <span className="text-xs font-mono bg-zinc-200 px-1.5 py-0.5 rounded">{v.sku}</span>}
                                                </div>
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {v.manufacturingDate ? new Date(v.manufacturingDate).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase">Formula Version</p>
                                                    <p>{v.formulaVersion || 'v1.0'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase">Active Tests</p>
                                                    <p>{v._count.tests} Tests conducted</p>
                                                </div>
                                            </div>

                                            {v.ingredients && (
                                                <div className="bg-green-50 p-3 rounded text-sm text-green-800 flex gap-2 mb-2">
                                                    <Beaker className="h-4 w-4 shrink-0 mt-0.5" />
                                                    <p className="whitespace-pre-wrap">{v.ingredients}</p>
                                                </div>
                                            )}

                                            {v.notes && (
                                                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex gap-2">
                                                    <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                                                    <p>{v.notes}</p>
                                                </div>
                                            )}

                                            <BatchActions variant={v} productId={product.id} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add New Batch Form */}
                            <div className="mt-8 pt-6 border-t">
                                <h3 className="text-lg font-semibold mb-4">Add New Batch / Variant</h3>
                                <form action={createProductVariant.bind(null, id)} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <label htmlFor="batchNumber" className="text-sm font-medium">Batch Number *</label>
                                            <Input id="batchNumber" name="batchNumber" placeholder="e.g. 001 or AUG-2024" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <label htmlFor="sku" className="text-sm font-medium">Specific Code / SKU</label>
                                            <Input id="sku" name="sku" placeholder="e.g. BR-01-A" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <label htmlFor="formulaVersion" className="text-sm font-medium">Formula Version</label>
                                            <Input id="formulaVersion" name="formulaVersion" placeholder="e.g. 1.1 revised" />
                                        </div>
                                        <div className="grid gap-2">
                                            <label htmlFor="manufacturingDate" className="text-sm font-medium">Manufacturing Date</label>
                                            <Input id="manufacturingDate" name="manufacturingDate" type="date" />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <label htmlFor="ingredients" className="text-sm font-medium">Ingredient List (Specific to this batch)</label>
                                        <Textarea id="ingredients" name="ingredients" placeholder="Paste full list or key changes..." rows={3} />
                                    </div>

                                    <div className="grid gap-2">
                                        <label htmlFor="notes" className="text-sm font-medium">Status / Issues Notes</label>
                                        <Textarea id="notes" name="notes" placeholder="e.g. 'Issues with viscosity noted in Batch 1'" rows={2} />
                                    </div>

                                    <SubmitButton className="w-full" loadingText="Adding Batch...">
                                        <Plus className="mr-2 h-4 w-4" /> Add Batch
                                    </SubmitButton>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1"><Tag className="h-3 w-3" /> Claims</span>
                                <span className="font-medium">{product.primaryClaim}</span>
                            </div>
                            {product.secondaryClaims && (
                                <div className="text-xs text-muted-foreground bg-zinc-50 p-2 rounded">
                                    {product.secondaryClaims}
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm pt-2 border-t text-muted-foreground">
                                <span className="flex items-center gap-1"><Beaker className="h-3 w-3" /> Total Variants</span>
                                <span className="font-medium text-foreground">{product.variants.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" /> Historic Tests</span>
                                <span className="font-medium text-foreground">{product.tests.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

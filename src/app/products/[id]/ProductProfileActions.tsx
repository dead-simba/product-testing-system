'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Edit2, Trash2, X, Save, AlertTriangle, Settings, Archive, ArchiveRestore } from 'lucide-react'
import { updateProduct, deleteProduct, archiveProduct, unarchiveProduct } from '../actions'
import { useRouter } from 'next/navigation'

interface ProductProfileActionsProps {
    product: any
}

export default function ProductProfileActions({ product }: ProductProfileActionsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleUpdate(formData: FormData) {
        setIsLoading(true)
        setError(null)
        try {
            await updateProduct(product.id, formData)
            setIsEditing(false)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to update product')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleArchive() {
        if (!confirm('Archive this product? It will be hidden from the main list but can be restored later.')) return

        setIsLoading(true)
        setError(null)
        try {
            await archiveProduct(product.id)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to archive product')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleUnarchive() {
        setIsLoading(true)
        setError(null)
        try {
            await unarchiveProduct(product.id)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to unarchive product')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        const hasTests = product._count?.tests > 0
        const hasVariants = product._count?.variants > 0

        let confirmMessage = 'Are you sure you want to PERMANENTLY DELETE this product?'
        if (hasTests || hasVariants) {
            const items = []
            if (hasTests) items.push(`${product._count.tests} test(s)`)
            if (hasVariants) items.push(`${product._count.variants} batch(es)`)

            confirmMessage = `⚠️ WARNING: This product has ${items.join(' and ')} associated with it.\n\nDeleting will PERMANENTLY remove:\n- The product\n${hasVariants ? `- All ${product._count.variants} batch records\n` : ''}${hasTests ? `- All ${product._count.tests} test records and their data\n` : ''}\nThis action CANNOT be undone.\n\nConsider using "Archive" instead to preserve history.\n\nAre you absolutely sure you want to DELETE?`
        }

        if (!confirm(confirmMessage)) return

        setIsLoading(true)
        setError(null)
        try {
            await deleteProduct(product.id)
            router.push('/products')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to delete product')
        } finally {
            setIsLoading(false)
        }
    }

    if (isEditing) {
        return (
            <Card className="border-orange-200 bg-orange-50/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-lg">Edit Product Details</CardTitle>
                        <CardDescription>Update general information and claims.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form action={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Product Name</label>
                            <Input name="name" defaultValue={product.name} required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Category</label>
                            <select
                                name="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                defaultValue={product.category}
                                required
                            >
                                <option value="serum">Serum</option>
                                <option value="moisturizer">Moisturizer</option>
                                <option value="cleanser">Cleanser</option>
                                <option value="spf">SPF</option>
                                <option value="toner">Toner</option>
                                <option value="treatment">Treatment</option>
                                <option value="oil">Oil</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
                            <select
                                name="status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                defaultValue={product.status}
                                required
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="TESTING">Testing</option>
                                <option value="OUT_OF_STOCK">Out of Stock</option>
                                <option value="DISCONTINUED">Discontinued</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Primary Claim</label>
                            <select
                                name="primaryClaim"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                defaultValue={product.primaryClaim}
                                required
                            >
                                <option value="anti-acne">Anti-Acne</option>
                                <option value="anti-aging">Anti-Aging</option>
                                <option value="brightening">Brightening</option>
                                <option value="hydrating">Hydrating</option>
                                <option value="soothing">Soothing</option>
                                <option value="texture">Texture Improvement</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Standard Volume</label>
                            <Input name="volume" defaultValue={product.volume} placeholder="e.g. 50ml, 1oz" />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Secondary Claims</label>
                            <Input name="secondaryClaims" defaultValue={product.secondaryClaims} placeholder="Comma separated claims" />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Usage Instructions</label>
                            <Textarea name="usageInstructions" defaultValue={product.usageInstructions} rows={3} />
                        </div>

                        {error && (
                            <div className="col-span-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="col-span-2 pt-2 flex gap-3">
                            <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
                                <Save className="h-4 w-4" /> {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-2">
            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            )}
            <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                    <Edit2 className="h-4 w-4" /> Edit Details
                </Button>
                {product.status === 'ARCHIVED' ? (
                    <Button onClick={handleUnarchive} variant="outline" className="gap-2 text-green-600 border-green-200 hover:bg-green-50" disabled={isLoading}>
                        <ArchiveRestore className="h-4 w-4" /> {isLoading ? 'Restoring...' : 'Unarchive'}
                    </Button>
                ) : (
                    <Button onClick={handleArchive} variant="outline" className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50" disabled={isLoading}>
                        <Archive className="h-4 w-4" /> {isLoading ? 'Archiving...' : 'Archive'}
                    </Button>
                )}
                <Button onClick={handleDelete} variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2" disabled={isLoading}>
                    <Trash2 className="h-4 w-4" /> {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
            </div>
        </div>
    )
}

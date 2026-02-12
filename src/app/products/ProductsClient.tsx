'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Package, Edit2, Trash2, Building2, Tag } from 'lucide-react'
import { deleteProduct } from './actions'
import { useRouter } from 'next/navigation'

interface Product {
    id: string
    name: string
    category: string
    primaryClaim: string
    status: string
    manufacturer: {
        name: string
    }
    _count: {
        variants: number
        tests: number
    }
}

interface ProductsClientProps {
    products: Product[]
}

export default function ProductsClient({ products }: ProductsClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const router = useRouter()

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.primaryClaim.toLowerCase().includes(searchQuery.toLowerCase())
    )

    async function handleDelete(id: string, name: string, variantCount: number, testCount: number) {
        const hasTests = testCount > 0
        const hasVariants = variantCount > 0

        let confirmMessage = `Are you sure you want to PERMANENTLY DELETE "${name}"?`
        if (hasTests || hasVariants) {
            const items = []
            if (hasTests) items.push(`${testCount} test(s)`)
            if (hasVariants) items.push(`${variantCount} batch(es)`)

            confirmMessage = `⚠️ WARNING: "${name}" has ${items.join(' and ')} associated with it.\n\nDeleting will PERMANENTLY remove:\n- The product\n${hasVariants ? `- All ${variantCount} batch records\n` : ''}${hasTests ? `- All ${testCount} test records and their data\n` : ''}\nThis action CANNOT be undone.\n\nConsider using "Archive" instead to preserve history.\n\nAre you absolutely sure you want to DELETE?`
        }

        if (!confirm(confirmMessage)) return

        setIsDeleting(id)
        try {
            await deleteProduct(id)
            router.refresh()
        } catch (error: any) {
            alert(error.message || 'Failed to delete product')
        } finally {
            setIsDeleting(null)
        }
    }

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

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Products</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr className="text-left text-muted-foreground">
                                    <th className="p-4 font-medium">Product Name</th>
                                    <th className="p-4 font-medium">Manufacturer</th>
                                    <th className="p-4 font-medium">Category</th>
                                    <th className="p-4 font-medium">Batches/Tests</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            {searchQuery ? 'No products match your search.' : 'No products found. Add your first product to get started.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-blue-600" />
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                    <Tag className="h-3 w-3" />
                                                    {product.primaryClaim}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Building2 className="h-3 w-3 text-muted-foreground" />
                                                    {product.manufacturer.name}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="capitalize text-sm">{product.category}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {product._count.variants} Batches
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        {product._count.tests} Tests
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'AVAILABLE'
                                                        ? 'bg-green-100 text-green-800'
                                                        : product.status === 'TESTING'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : product.status === 'ARCHIVED'
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/products/${product.id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <Edit2 className="h-3 w-3" />
                                                            Manage
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(product.id, product.name, product._count.variants, product._count.tests)}
                                                        disabled={isDeleting === product.id}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        {isDeleting === product.id ? 'Deleting...' : 'Delete'}
                                                    </Button>
                                                </div>
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

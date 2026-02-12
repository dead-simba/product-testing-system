'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Building2, Edit2, Trash2, Globe, User, Mail } from 'lucide-react'
import { deleteManufacturer } from './actions'
import { useRouter } from 'next/navigation'

interface Manufacturer {
    id: string
    name: string
    website: string | null
    contactName: string | null
    email: string | null
    status: string
    _count: {
        products: number
    }
}

interface ManufacturersClientProps {
    manufacturers: Manufacturer[]
}

export default function ManufacturersClient({ manufacturers }: ManufacturersClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const router = useRouter()

    const filteredManufacturers = manufacturers.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    async function handleDelete(id: string, name: string, productCount: number) {
        const hasProducts = productCount > 0

        let confirmMessage = `Are you sure you want to PERMANENTLY DELETE "${name}"?`
        if (hasProducts) {
            confirmMessage = `⚠️ WARNING: "${name}" has ${productCount} product(s) associated with it.\n\nDeleting will PERMANENTLY remove:\n- The manufacturer\n- All ${productCount} product records\n- All associated batches and test data\n\nThis action CANNOT be undone.\n\nConsider using "Archive" instead to preserve history.\n\nAre you absolutely sure you want to DELETE?`
        }

        if (!confirm(confirmMessage)) return

        setIsDeleting(id)
        try {
            await deleteManufacturer(id)
            router.refresh()
        } catch (error: any) {
            alert(error.message || 'Failed to delete manufacturer')
        } finally {
            setIsDeleting(null)
        }
    }

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

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Manufacturers</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search manufacturers..."
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
                                    <th className="p-4 font-medium">Company Name</th>
                                    <th className="p-4 font-medium">Contact Info</th>
                                    <th className="p-4 font-medium">Products</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredManufacturers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            {searchQuery ? 'No manufacturers match your search.' : 'No manufacturers found. Add your first manufacturer to get started.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredManufacturers.map((manufacturer) => (
                                        <tr key={manufacturer.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-blue-600" />
                                                    {manufacturer.name}
                                                </div>
                                                {manufacturer.website && (
                                                    <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                                        <Globe className="h-3 w-3" />
                                                        <a
                                                            href={manufacturer.website.startsWith('http') ? manufacturer.website : `https://${manufacturer.website}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:underline"
                                                        >
                                                            {manufacturer.website.replace(/^https?:\/\//, '')}
                                                        </a>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {manufacturer.contactName && (
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <User className="h-3 w-3 text-muted-foreground" />
                                                        {manufacturer.contactName}
                                                    </div>
                                                )}
                                                {manufacturer.email && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                        <Mail className="h-3 w-3" />
                                                        {manufacturer.email}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100">
                                                    {manufacturer._count.products} Products
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${manufacturer.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {manufacturer.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/manufacturers/${manufacturer.id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <Edit2 className="h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(manufacturer.id, manufacturer.name, manufacturer._count.products)}
                                                        disabled={isDeleting === manufacturer.id}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        {isDeleting === manufacturer.id ? 'Deleting...' : 'Delete'}
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

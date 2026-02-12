'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle, Archive, ArchiveRestore } from 'lucide-react'
import { deleteManufacturer, archiveManufacturer, unarchiveManufacturer } from '../actions'
import { useRouter } from 'next/navigation'

interface ManufacturerActionsProps {
    manufacturer: any
}

export default function ManufacturerActions({ manufacturer }: ManufacturerActionsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleArchive() {
        if (!confirm('Archive this manufacturer? They will be hidden from the main list but their data will be preserved.')) return

        setIsLoading(true)
        setError(null)
        try {
            const result = await archiveManufacturer(manufacturer.id)
            if (result.success) {
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Failed to archive manufacturer')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleUnarchive() {
        setIsLoading(true)
        setError(null)
        try {
            const result = await unarchiveManufacturer(manufacturer.id)
            if (result.success) {
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Failed to unarchive manufacturer')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        const hasProducts = manufacturer.products?.length > 0

        let confirmMessage = 'Are you sure you want to PERMANENTLY DELETE this manufacturer?'
        if (hasProducts) {
            confirmMessage = `⚠️ WARNING: This manufacturer has ${manufacturer.products.length} product(s) associated with it.\n\nDeleting will PERMANENTLY remove:\n- The manufacturer profile\n- All ${manufacturer.products.length} products\n- All associated batches and test records\n\nThis action CANNOT be undone.\n\nConsider using "Archive" instead to preserve history.\n\nAre you absolutely sure you want to DELETE?`
        }

        if (!confirm(confirmMessage)) return

        setIsLoading(true)
        setError(null)
        try {
            const result = await deleteManufacturer(manufacturer.id)
            if (result.success) {
                router.push('/manufacturers')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete manufacturer')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-2">
                {manufacturer.status === 'ARCHIVED' ? (
                    <Button onClick={handleUnarchive} variant="outline" className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50" disabled={isLoading}>
                        <ArchiveRestore className="h-4 w-4" /> {isLoading ? 'Restoring...' : 'Unarchive Manufacturer'}
                    </Button>
                ) : (
                    <Button onClick={handleArchive} variant="outline" className="w-full gap-2 text-orange-600 border-orange-200 hover:bg-orange-50" disabled={isLoading}>
                        <Archive className="h-4 w-4" /> {isLoading ? 'Archiving...' : 'Archive Manufacturer'}
                    </Button>
                )}

                <Button onClick={handleDelete} variant="destructive" className="w-full gap-2" disabled={isLoading}>
                    <Trash2 className="h-4 w-4" /> {isLoading ? 'Deleting...' : 'Delete Permanently'}
                </Button>
            </div>
        </div>
    )
}

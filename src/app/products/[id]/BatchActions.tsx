'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit2, Trash2, X, Save, AlertTriangle } from 'lucide-react'
import { updateProductVariant, deleteProductVariant } from '../actions'
import { useRouter } from 'next/navigation'

interface BatchActionsProps {
    variant: {
        id: string
        batchNumber: string
        sku: string | null
        formulaVersion: string | null
        ingredients: string | null
        notes: string | null
        manufacturingDate: Date | null
    }
    productId: string
}

export default function BatchActions({ variant, productId }: BatchActionsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleUpdate(formData: FormData) {
        setIsLoading(true)
        setError(null)
        try {
            const result = await updateProductVariant(variant.id, productId, formData)
            if (result.success) {
                setIsEditing(false)
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update batch')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this batch? This action cannot be undone.')) return

        setIsLoading(true)
        setError(null)
        try {
            const result = await deleteProductVariant(variant.id, productId)
            if (result.success) {
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete batch')
        } finally {
            setIsLoading(false)
        }
    }

    if (isEditing) {
        return (
            <div className="mt-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-orange-900">Edit Batch {variant.batchNumber}</h4>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} disabled={isLoading}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <form action={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Batch Number</label>
                            <Input name="batchNumber" defaultValue={variant.batchNumber} required className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">SKU / Code</label>
                            <Input name="sku" defaultValue={variant.sku || ''} className="h-8 text-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Formula Version</label>
                            <Input name="formulaVersion" defaultValue={variant.formulaVersion || ''} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Mfg Date</label>
                            <Input name="manufacturingDate" type="date" defaultValue={variant.manufacturingDate ? new Date(variant.manufacturingDate).toISOString().split('T')[0] : ''} className="h-8 text-sm" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Ingredients Override</label>
                        <Textarea name="ingredients" defaultValue={variant.ingredients || ''} rows={2} className="text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Status / Issues Notes</label>
                        <Textarea name="notes" defaultValue={variant.notes || ''} rows={2} className="text-sm" />
                    </div>

                    {error && (
                        <div className="p-2 bg-red-50 text-red-700 text-[10px] rounded flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button type="submit" size="sm" className="flex-1 gap-2 bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                            <Save className="h-3 w-3" /> {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setIsEditing(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="flex gap-2 justify-end mt-4">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-orange-600">
                <Edit2 className="h-3 w-3" /> Edit Batch
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isLoading} className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-3 w-3" /> {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
        </div>
    )
}

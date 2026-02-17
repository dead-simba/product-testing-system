'use client'

import { useState } from 'react'
import { Plus, Trash2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Product {
    id: string
    name: string
    variants: {
        id: string
        batchNumber: string
        sku: string | null
    }[]
}

export function MultiProductAssignment({ products }: { products: Product[] }) {
    const [assignments, setAssignments] = useState([{ id: Date.now(), variantId: '', size: '' }])

    const addAssignment = () => {
        setAssignments([...assignments, { id: Date.now(), variantId: '', size: '' }])
    }

    const removeAssignment = (id: number) => {
        if (assignments.length > 1) {
            setAssignments(assignments.filter(a => a.id !== id))
        }
    }

    return (
        <div className="space-y-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-600" /> Product Assignment
                </h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAssignment}
                    className="h-7 gap-1 text-xs"
                >
                    <Plus size={12} /> Add Product
                </Button>
            </div>

            <div className="space-y-4">
                {assignments.map((assignment, index) => (
                    <div key={assignment.id} className="relative grid gap-3 p-3 bg-white border rounded-md shadow-sm animate-in fade-in zoom-in duration-200">
                        {assignments.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeAssignment(assignment.id)}
                                className="absolute -top-2 -right-2 p-1 bg-white border shadow-sm rounded-full text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}

                        <div className="grid gap-2">
                            <label className="text-xs font-medium">Select Product & Batch *</label>
                            <select
                                name="productVariantId"
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="">Choose a specific batch...</option>
                                {products.map(p => (
                                    <optgroup key={p.id} label={p.name}>
                                        {p.variants.length === 0 && (
                                            <option disabled>No batches available</option>
                                        )}
                                        {p.variants.map(v => (
                                            <option key={v.id} value={v.id}>
                                                {p.name} - Batch {v.batchNumber} {v.sku ? `(${v.sku})` : ''}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-medium">Size Given to Tester</label>
                            <Input
                                name="productSize"
                                placeholder="e.g. 15ml Sample, 50ml Full Size"
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-[10px] text-muted-foreground italic">
                You can assign multiple products to this tester. Each will create a separate active test.
            </p>
        </div>
    )
}

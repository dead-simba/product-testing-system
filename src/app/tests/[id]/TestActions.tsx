'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Ban, AlertCircle, Save, X, AlertTriangle } from 'lucide-react'
import { deleteTest, discontinueTest } from '../actions'
import { useRouter } from 'next/navigation'

interface TestActionsProps {
    testId: string
    status: string
}

export default function TestActions({ testId, status }: TestActionsProps) {
    const [isDiscontinuing, setIsDiscontinuing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reason, setReason] = useState('')
    const router = useRouter()

    async function handleDiscontinue(e: React.FormEvent) {
        e.preventDefault()
        if (!reason) {
            setError('Please provide a reason for discontinuation.')
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            await discontinueTest(testId, reason)
            setIsDiscontinuing(false)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to discontinue test')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to PERMANENTLY DELETE this test entry? This will revert the status of the tester and product to AVAILABLE.')) return

        setIsLoading(true)
        setError(null)
        try {
            await deleteTest(testId)
            router.push('/tests')
        } catch (err: any) {
            setError(err.message || 'Failed to delete test')
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'DISCONTINUED' || status === 'COMPLETED') {
        return (
            <div className="space-y-2">
                {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}
                <div className="flex gap-2">
                    <Button onClick={handleDelete} variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2" disabled={isLoading}>
                        <Trash2 size={16} /> {isLoading ? 'Deleting...' : 'Delete Test Record'}
                    </Button>
                </div>
            </div>
        )
    }

    if (isDiscontinuing) {
        return (
            <Card className="border-red-200 bg-red-50/30 w-full max-w-md ml-auto">
                <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                        <AlertCircle size={18} /> Discontinue Test
                    </div>
                    <form onSubmit={handleDiscontinue} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Reason for Discontinuation</label>
                            <Textarea
                                placeholder="e.g. Adverse reaction, tester withdrew, lost product..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="text-sm bg-white"
                                required
                            />
                        </div>
                        {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
                        <div className="flex gap-2">
                            <Button type="submit" size="sm" variant="destructive" className="flex-1 gap-1" disabled={isLoading}>
                                <Ban size={14} /> {isLoading ? 'Processing...' : 'Confirm Stop'}
                            </Button>
                            <Button type="button" size="sm" variant="outline" className="flex-1" onClick={() => setIsDiscontinuing(false)} disabled={isLoading}>
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
                <Button onClick={() => setIsDiscontinuing(true)} variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 gap-2">
                    <Ban size={16} /> Discontinue
                </Button>
                <Button onClick={handleDelete} variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2" disabled={isLoading}>
                    <Trash2 size={16} /> {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
            </div>
        </div>
    )
}

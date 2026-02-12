'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Edit2, Trash2, X, Save, AlertTriangle, Archive, ArchiveRestore } from 'lucide-react'
import { updateTester, deleteTester, archiveTester, unarchiveTester } from '../actions'
import { useRouter } from 'next/navigation'

interface TesterProfileActionsProps {
    tester: any
}

export default function TesterProfileActions({ tester }: TesterProfileActionsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleUpdate(formData: FormData) {
        setIsLoading(true)
        setError(null)
        try {
            await updateTester(tester.id, formData)
            setIsEditing(false)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to update tester')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleArchive() {
        if (!confirm('Archive this tester? They will be hidden from the main list but can be restored later.')) return

        setIsLoading(true)
        setError(null)
        try {
            await archiveTester(tester.id)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to archive tester')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleUnarchive() {
        setIsLoading(true)
        setError(null)
        try {
            await unarchiveTester(tester.id)
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to unarchive tester')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        const hasTests = tester._count?.tests > 0

        let confirmMessage = 'Are you sure you want to PERMANENTLY DELETE this tester?'
        if (hasTests) {
            confirmMessage = `⚠️ WARNING: This tester has ${tester._count.tests} test(s) in their history.\n\nDeleting will PERMANENTLY remove:\n- The tester profile\n- All ${tester._count.tests} test records\n- All associated assessments and feedback\n\nThis action CANNOT be undone.\n\nConsider using "Archive" instead to preserve history.\n\nAre you absolutely sure you want to DELETE?`
        }

        if (!confirm(confirmMessage)) return

        setIsLoading(true)
        setError(null)
        try {
            await deleteTester(tester.id)
            router.push('/testers')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to delete tester')
        } finally {
            setIsLoading(false)
        }
    }

    if (isEditing) {
        return (
            <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-lg">Edit Tester Profile</CardTitle>
                        <CardDescription>Update personal details and skin concerns.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form action={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">First Name</label>
                                <Input name="firstName" defaultValue={tester.firstName} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Last Name</label>
                                <Input name="lastName" defaultValue={tester.lastName} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Email</label>
                                <Input name="email" type="email" defaultValue={tester.email} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Phone</label>
                                <Input name="phone" defaultValue={tester.phone} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Age</label>
                                <Input name="age" type="number" defaultValue={tester.age} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Gender</label>
                                <select
                                    name="gender"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    defaultValue={tester.gender}
                                    required
                                >
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
                                <select
                                    name="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    defaultValue={tester.status}
                                    required
                                >
                                    <option value="AVAILABLE">Available</option>
                                    <option value="TESTING">Testing</option>
                                    <option value="UNAVAILABLE">Unavailable</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Skin Type</label>
                                <select
                                    name="skinType"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    defaultValue={tester.skinType}
                                    required
                                >
                                    <option value="oily">Oily</option>
                                    <option value="dry">Dry</option>
                                    <option value="combination">Combination</option>
                                    <option value="normal">Normal</option>
                                    <option value="sensitive">Sensitive</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Primary Concern</label>
                                <select
                                    name="primaryConcern"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    defaultValue={tester.primaryConcern}
                                    required
                                >
                                    <option value="acne">Acne</option>
                                    <option value="aging">Aging/Wrinkles</option>
                                    <option value="hyperpigmentation">Hyperpigmentation</option>
                                    <option value="dryness">Dryness</option>
                                    <option value="dullness">Dullness</option>
                                    <option value="texture">Texture</option>
                                    <option value="redness">Redness/Sensitivity</option>
                                    <option value="pores">Large Pores</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Secondary Concerns</label>
                            <Input name="secondaryConcerns" defaultValue={tester.secondaryConcerns} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Location</label>
                            <Input name="location" defaultValue={tester.location} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Allergies</label>
                            <Input name="allergies" defaultValue={tester.allergies} />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="pt-2 flex gap-3">
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
                    <Edit2 className="h-4 w-4" /> Edit Profile
                </Button>
                {tester.status === 'ARCHIVED' ? (
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

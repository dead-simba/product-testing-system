'use client'

import { createTester } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewTesterPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <Link href="/testers" className="text-sm text-muted-foreground flex items-center hover:text-blue-600 mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Testers
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Add New Tester</h1>
                <p className="text-muted-foreground">Register a new participant for product testing.</p>
            </div>

            <form action={createTester}>
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Contact details and demographics.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <Input name="firstName" required placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <Input name="lastName" required placeholder="Doe" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input name="email" type="email" placeholder="jane@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input name="phone" placeholder="+1234567890" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Age</label>
                                <Input name="age" type="number" required min="18" placeholder="25" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gender</label>
                                <select name="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                                    <option value="">Select...</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input name="location" placeholder="City, Country" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Skin Profile</CardTitle>
                        <CardDescription>Critical information for product matching.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Skin Type</label>
                                <select name="skinType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                                    <option value="">Select...</option>
                                    <option value="oily">Oily</option>
                                    <option value="dry">Dry</option>
                                    <option value="combination">Combination</option>
                                    <option value="normal">Normal</option>
                                    <option value="sensitive">Sensitive</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Primary Concern</label>
                                <select name="primaryConcern" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                                    <option value="">Select...</option>
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
                            <label className="text-sm font-medium">Secondary Concerns (Comma separated)</label>
                            <Input name="secondaryConcerns" placeholder="e.g. blackheads, undereye circles" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Known Allergies</label>
                            <Input name="allergies" placeholder="e.g. fragrance, tea tree oil" />
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end gap-4">
                    <Link href="/testers">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit">Create Tester</Button>
                </div>
            </form>
        </div>
    )
}

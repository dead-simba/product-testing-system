import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Save, Building2 } from 'lucide-react'
import { createManufacturer } from '../actions'

export default function NewManufacturerPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/manufacturers" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Manufacturers
            </Link>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Add Manufacturer</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Enter the details for your production partner.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createManufacturer} className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Company Name *</label>
                            <Input id="name" name="name" placeholder="e.g. Luma Labs Production" required />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="website" className="text-sm font-medium">Website</label>
                            <Input id="website" name="website" placeholder="https://example.com" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="contactName" className="text-sm font-medium">Contact Person</label>
                                <Input id="contactName" name="contactName" placeholder="Full name" />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                <Input id="email" name="email" type="email" placeholder="contact@example.com" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="notes" className="text-sm font-medium">Internal Notes</label>
                            <Textarea id="notes" name="notes" placeholder="Agreements, quality standards, or batch history..." rows={4} />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button type="submit" className="flex-1">
                                <Save className="mr-2 h-4 w-4" /> Save Manufacturer
                            </Button>
                            <Link href="/manufacturers" className="flex-1">
                                <Button variant="outline" className="w-full">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

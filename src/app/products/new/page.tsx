import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Save, Package, Building2, Tag } from 'lucide-react'
import { createProduct } from '../actions'

const COMMON_CATEGORIES = ['Serum', 'Moisturizer', 'Cleanser', 'Toner', 'SPF', 'Oil', 'Mask', 'Treatment']
const COMMON_CLAIMS = ['Anti-Acne', 'Anti-Aging', 'Hydrating', 'Brightening', 'Soothing', 'Pore-Tightening', 'Barrier-Repair']

export default async function NewProductPage() {
    const manufacturers = await prisma.manufacturer.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/products" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Link>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Define the high-level details of the product. Specific batches/formulas will be added after creation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createProduct} className="space-y-6">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Product Name *</label>
                            <Input id="name" name="name" placeholder="e.g. Barrier Repair Night Cream" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="manufacturerId" className="text-sm font-medium flex items-center gap-1">
                                    <Building2 className="h-3 w-3" /> Manufacturer *
                                </label>
                                <select
                                    id="manufacturerId"
                                    name="manufacturerId"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="">Select Manufacturer...</option>
                                    {manufacturers.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-muted-foreground">Manufacturer not listed? <Link href="/manufacturers/new" className="text-blue-600 hover:underline">Add it first</Link></p>
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="category" className="text-sm font-medium">Category *</label>
                                <select
                                    id="category"
                                    name="category"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    {COMMON_CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="primaryClaim" className="text-sm font-medium flex items-center gap-1">
                                    <Tag className="h-3 w-3" /> Primary Claim *
                                </label>
                                <select
                                    id="primaryClaim"
                                    name="primaryClaim"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    {COMMON_CLAIMS.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="secondaryClaims" className="text-sm font-medium">Secondary Claims / Benefits</label>
                                <Input id="secondaryClaims" name="secondaryClaims" placeholder="e.g. Antioxidant, Non-greasy (comma separated)" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="usageInstructions" className="text-sm font-medium">Usage Instructions</label>
                            <Textarea id="usageInstructions" name="usageInstructions" placeholder="How should the tester use this product? (e.g. Apply pea-sized amount at night...)" rows={3} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="volume" className="text-sm font-medium">Standard Volume</label>
                            <Input id="volume" name="volume" placeholder="e.g. 50ml or 1.7 oz" />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button type="submit" className="flex-1">
                                <Save className="mr-2 h-4 w-4" /> Create Product
                            </Button>
                            <Link href="/products" className="flex-1">
                                <Button variant="outline" className="w-full">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

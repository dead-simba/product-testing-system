import prisma from '@/lib/prisma'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            manufacturer: true,
            _count: { select: { variants: true, tests: true } }
        },
        orderBy: { updatedAt: 'desc' }
    })

    return <ProductsClient products={products} />
}

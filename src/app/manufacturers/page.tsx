import prisma from '@/lib/prisma'
import ManufacturersClient from './ManufacturersClient'

export default async function ManufacturersPage() {
    const manufacturers = await prisma.manufacturer.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return <ManufacturersClient manufacturers={manufacturers} />
}

import prisma from './src/lib/prisma.js'

async function main() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, createdAt: true }
    })
    console.log(JSON.stringify(products, null, 2))
}

main()

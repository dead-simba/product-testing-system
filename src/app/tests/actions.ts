'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'



export async function createTest(formData: FormData) {
    const testerId = formData.get('testerId') as string
    const productVariantId = formData.get('productVariantId') as string
    const productSize = formData.get('productSize') as string

    // Find the variant to get the productId
    const variant = await prisma.productVariant.findUnique({
        where: { id: productVariantId },
        select: { productId: true }
    })

    if (!variant) throw new Error('Product batch not found')
    const productId = variant.productId

    const durationDays = parseInt(formData.get('durationDays') as string)
    const feedbackSchedule = formData.get('feedbackSchedule') as string
    const startDateStr = formData.get('startDate') as string

    const startDate = startDateStr ? new Date(startDateStr) : new Date()

    // Fetch tester profile for snapshot
    const tester = await prisma.tester.findUnique({
        where: { id: testerId }
    })

    if (!tester) throw new Error('Tester not found')

    const testerSnapshot = JSON.stringify({
        skinType: tester.skinType,
        primaryConcern: tester.primaryConcern,
        age: tester.age,
        location: tester.location
    })

    // Transaction for atomic update/create
    await prisma.$transaction(async (tx) => {
        await tx.tester.update({
            where: { id: testerId },
            data: { status: 'TESTING' }
        })

        await tx.product.update({
            where: { id: productId },
            data: { status: 'TESTING' }
        })

        const test = await tx.test.create({
            data: {
                testerId,
                productId,
                productVariantId: productVariantId || null,
                productSize: productSize || null,
                durationDays,
                feedbackSchedule,
                startDate,
                status: 'ACTIVE'
            }
        })

        // Create initial baseline record with the snapshot
        await tx.baselineAssessment.create({
            data: {
                testId: test.id,
                testerSnapshot,
                metrics: '{}' // Empty metrics to start
            }
        })
    })

    revalidatePath('/tests')
    revalidatePath('/testers')
    revalidatePath('/products')
    redirect('/tests')
}

export async function discontinueTest(id: string, reason: string) {
    const test = await prisma.test.findUnique({
        where: { id },
        include: { tester: true, product: true }
    })

    if (!test) throw new Error('Test not found')

    await prisma.$transaction(async (tx) => {
        await tx.test.update({
            where: { id },
            data: {
                status: 'DISCONTINUED',
                // We could add a notes field if needed, but for now we follow schema
            }
        })

        await tx.tester.update({
            where: { id: test.testerId },
            data: { status: 'AVAILABLE' }
        })

        await tx.product.update({
            where: { id: test.productId },
            data: { status: 'AVAILABLE' }
        })
    })

    revalidatePath('/tests')
    revalidatePath(`/tests/${id}`)
    revalidatePath('/testers')
    revalidatePath('/products')
}

export async function deleteTest(id: string) {
    const test = await prisma.test.findUnique({
        where: { id }
    })

    if (!test) throw new Error('Test not found')

    await prisma.$transaction(async (tx) => {
        // Reset statuses first
        await tx.tester.update({
            where: { id: test.testerId },
            data: { status: 'AVAILABLE' }
        })

        await tx.product.update({
            where: { id: test.productId },
            data: { status: 'AVAILABLE' }
        })

        // Cascade delete will handle baseline and feedback if configured, 
        // otherwise we manually delete or check schema.
        await tx.test.delete({
            where: { id }
        })
    })

    revalidatePath('/tests')
    revalidatePath('/testers')
    revalidatePath('/products')
    return { success: true }
}


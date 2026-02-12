'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'



export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string
    const manufacturerId = formData.get('manufacturerId') as string
    const category = formData.get('category') as string
    const primaryClaim = formData.get('primaryClaim') as string
    const secondaryClaims = formData.get('secondaryClaims') as string // Likely a comma-separated string from form
    const usageInstructions = formData.get('usageInstructions') as string
    const volume = formData.get('volume') as string

    await prisma.product.create({
        data: {
            name,
            category,
            primaryClaim,
            secondaryClaims,
            usageInstructions,
            volume,
            manufacturerId,
            status: 'AVAILABLE',
            effectivenessScore: 0.0,
            safetyScore: 100.0
        }
    })

    revalidatePath('/products')
    redirect('/products')
}

export async function createProductVariant(productId: string, formData: FormData) {
    const batchNumber = formData.get('batchNumber') as string
    const sku = formData.get('sku') as string
    const formulaVersion = formData.get('formulaVersion') as string
    const ingredients = formData.get('ingredients') as string
    const notes = formData.get('notes') as string
    const manufacturingDateStr = formData.get('manufacturingDate') as string

    await prisma.productVariant.create({
        data: {
            productId,
            batchNumber,
            sku: sku || null,
            formulaVersion: formulaVersion || null,
            ingredients: ingredients || null,
            notes: notes || null,
            manufacturingDate: manufacturingDateStr ? new Date(manufacturingDateStr) : null,
        }
    })

    revalidatePath(`/products/${productId}`)
    redirect(`/products/${productId}`)
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const primaryClaim = formData.get('primaryClaim') as string
    const secondaryClaims = formData.get('secondaryClaims') as string
    const usageInstructions = formData.get('usageInstructions') as string
    const volume = formData.get('volume') as string
    const status = formData.get('status') as string

    await prisma.product.update({
        where: { id },
        data: {
            name,
            category,
            primaryClaim,
            secondaryClaims,
            usageInstructions,
            volume,
            status
        }
    })

    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { success: true }
}

export async function archiveProduct(id: string) {
    await prisma.product.update({
        where: { id },
        data: { status: 'ARCHIVED' }
    })

    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { success: true }
}

export async function unarchiveProduct(id: string) {
    await prisma.product.update({
        where: { id },
        data: { status: 'AVAILABLE' }
    })

    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { success: true }
}

export async function deleteProduct(id: string) {
    // No longer blocking - just delete with cascading
    await prisma.product.delete({
        where: { id }
    })

    revalidatePath('/products')
    return { success: true }
}


export async function updateProductVariant(id: string, productId: string, formData: FormData) {
    const batchNumber = formData.get('batchNumber') as string
    const sku = formData.get('sku') as string
    const formulaVersion = formData.get('formulaVersion') as string
    const ingredients = formData.get('ingredients') as string
    const notes = formData.get('notes') as string
    const manufacturingDateStr = formData.get('manufacturingDate') as string

    await prisma.productVariant.update({
        where: { id },
        data: {
            batchNumber,
            sku: sku || null,
            formulaVersion: formulaVersion || null,
            ingredients: ingredients || null,
            notes: notes || null,
            manufacturingDate: manufacturingDateStr ? new Date(manufacturingDateStr) : null,
        }
    })

    revalidatePath(`/products/${productId}`)
    return { success: true }
}

export async function deleteProductVariant(id: string, productId: string) {
    // Check if variant has any tests
    const variant = await prisma.productVariant.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    tests: true
                }
            }
        }
    })

    if (variant && variant._count.tests > 0) {
        throw new Error('Cannot delete a batch that has existing test history.')
    }

    await prisma.productVariant.delete({
        where: { id }
    })

    revalidatePath(`/products/${productId}`)
    return { success: true }
}

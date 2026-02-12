'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createManufacturer(formData: FormData) {
    const name = formData.get('name') as string
    const website = formData.get('website') as string
    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const notes = formData.get('notes') as string

    await prisma.manufacturer.create({
        data: {
            name,
            website: website || null,
            contactName: contactName || null,
            email: email || null,
            notes: notes || null,
        }
    })

    revalidatePath('/manufacturers')
    redirect('/manufacturers')
}

export async function updateManufacturer(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const website = formData.get('website') as string
    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const notes = formData.get('notes') as string

    await prisma.manufacturer.update({
        where: { id },
        data: {
            name,
            website: website || null,
            contactName: contactName || null,
            email: email || null,
            notes: notes || null,
        }
    })

    revalidatePath('/manufacturers')
    revalidatePath(`/manufacturers/${id}`)
    redirect('/manufacturers')
}

export async function archiveManufacturer(id: string) {
    await prisma.manufacturer.update({
        where: { id },
        data: { status: 'ARCHIVED' }
    })

    revalidatePath('/manufacturers')
    revalidatePath(`/manufacturers/${id}`)
    return { success: true }
}

export async function unarchiveManufacturer(id: string) {
    await prisma.manufacturer.update({
        where: { id },
        data: { status: 'ACTIVE' }
    })

    revalidatePath('/manufacturers')
    revalidatePath(`/manufacturers/${id}`)
    return { success: true }
}

export async function deleteManufacturer(id: string) {
    await prisma.manufacturer.delete({
        where: { id }
    })

    revalidatePath('/manufacturers')
    return { success: true }
}

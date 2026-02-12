'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'



export async function createTester(formData: FormData) {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const age = parseInt(formData.get('age') as string)
    const gender = formData.get('gender') as string
    const location = formData.get('location') as string
    const skinType = formData.get('skinType') as string
    const primaryConcern = formData.get('primaryConcern') as string

    // Handling multi-selects or complex fields as simple strings for MVP
    // Ideally use a more robust form handling library or JSON parsing
    const secondaryConcerns = formData.get('secondaryConcerns') as string || ''
    const allergies = formData.get('allergies') as string || ''

    await prisma.tester.create({
        data: {
            firstName,
            lastName,
            email,
            phone,
            age,
            gender,
            location,
            skinType,
            primaryConcern,
            secondaryConcerns,
            allergies,
            reliabilityScore: 100.0, // Default start
            status: 'AVAILABLE'
        }
    })

    revalidatePath('/testers')
    redirect('/testers')
}

export async function updateTester(id: string, formData: FormData) {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const age = parseInt(formData.get('age') as string)
    const gender = formData.get('gender') as string
    const location = formData.get('location') as string
    const skinType = formData.get('skinType') as string
    const primaryConcern = formData.get('primaryConcern') as string
    const secondaryConcerns = formData.get('secondaryConcerns') as string || ''
    const allergies = formData.get('allergies') as string || ''
    const status = formData.get('status') as string

    await prisma.tester.update({
        where: { id },
        data: {
            firstName,
            lastName,
            email,
            phone,
            age,
            gender,
            location,
            skinType,
            primaryConcern,
            secondaryConcerns,
            allergies,
            status
        }
    })

    revalidatePath('/testers')
    revalidatePath(`/testers/${id}`)
    return { success: true }
}

export async function archiveTester(id: string) {
    await prisma.tester.update({
        where: { id },
        data: { status: 'ARCHIVED' }
    })

    revalidatePath('/testers')
    revalidatePath(`/testers/${id}`)
    return { success: true }
}

export async function unarchiveTester(id: string) {
    await prisma.tester.update({
        where: { id },
        data: { status: 'AVAILABLE' }
    })

    revalidatePath('/testers')
    revalidatePath(`/testers/${id}`)
    return { success: true }
}

export async function deleteTester(id: string) {
    // No longer blocking - just delete with cascading
    await prisma.tester.delete({
        where: { id }
    })

    revalidatePath('/testers')
    return { success: true }
}

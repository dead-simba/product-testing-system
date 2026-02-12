'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function saveFeedback(testId: string, day: number, formData: FormData) {
    // Extract photo URLs from hidden input (Direct uploads)
    const photosJson = formData.get('photos_json') as string
    const photoUrls: string[] = photosJson ? JSON.parse(photosJson) : []

    // Extract data from form
    const adverse_reaction = formData.get('adverse_reaction') as string
    const compliancy = formData.get('compliancy') as string

    // Effectiveness (Convert to numbers)
    const absorption = Number(formData.get('absorption') || 0)
    const texture_imp = Number(formData.get('texture_imp') || 0)
    const hydration = Number(formData.get('hydration') || 0)
    const primary_imp = Number(formData.get('primary_imp') || 0)
    const overall_imp = Number(formData.get('overall_imp') || 0)

    // UX
    const smell = formData.get('smell') as string
    const texture = formData.get('texture') as string
    const application = formData.get('application') as string
    const satisfaction = Number(formData.get('satisfaction') || 0)

    // Emotional
    const skin_looks = formData.get('skin_looks') as string
    const continue_using = formData.get('continue_using') as string
    const confidence = Number(formData.get('confidence') || 0)

    const notes = formData.get('notes') as string

    // Construct JSON Data Payload
    const feedbackData = {
        physical_response: {
            adverse_reaction,
            compliancy
        },
        effectiveness_metrics: {
            absorption,
            texture_improvement: texture_imp,
            hydration,
            primary_improvement: primary_imp,
            overall_improvement: overall_imp
        },
        user_experience: {
            smell,
            texture,
            application,
            satisfaction
        },
        emotional_read: {
            skin_looks,
            continue_using,
            confidence
        },
        admin_notes: notes
    }

    // Save to DB
    await prisma.feedbackEntry.create({
        data: {
            testId,
            day,
            date: new Date(),
            isCompleted: true,
            data: JSON.stringify(feedbackData),
            photos: JSON.stringify(photoUrls)
        }
    })

    // Optional: Update simple running average score on Product if needed
    // For now, we just save the entry.

    revalidatePath(`/tests/${testId}`)
    redirect(`/tests/${testId}`)
}

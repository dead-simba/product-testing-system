import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'



export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: testId } = await params

    const test = await prisma.test.findUnique({
        where: { id: testId },
        include: {
            tester: true,
            product: {
                include: { manufacturer: true }
            },
            productVariant: true,
            feedbackEntries: {
                orderBy: { day: 'asc' }
            },
            baselineAssessment: true,
            finalAssessment: true
        }
    })

    if (!test) {
        return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Calculate completeness
    // Simple logic: feedback count / duration
    const completeness = Math.min(100, Math.round((test.feedbackEntries.length / test.durationDays) * 100))

    // Construct JSON compliant with PRD 5.2
    const exportData = {
        test_metadata: {
            test_id: test.id,
            test_version: "1.0",
            export_date: new Date().toISOString(),
            data_completeness: `${completeness}%`
        },
        test_configuration: {
            start_date: test.startDate.toISOString().split('T')[0], // YYYY-MM-DD
            end_date: test.endDate ? test.endDate.toISOString().split('T')[0] : null,
            test_duration_days: test.durationDays,
            feedback_schedule: test.feedbackSchedule,
            completed_feedback_count: test.feedbackEntries.length,
            test_status: test.status
        },
        product: {
            product_id: test.product.id,
            product_name: test.product.name,
            manufacturer: {
                name: test.product.manufacturer?.name || "Unknown",
                manufacturer_id: test.product.manufacturerId
            },
            category: test.product.category,
            primary_claim: test.product.primaryClaim,
            ingredients: test.productVariant?.ingredients || "N/A", // From batch level
            usage_instructions: test.product.usageInstructions
        },
        tester: {
            tester_id: test.tester.id,
            demographics: {
                age: test.tester.age,
                gender: test.tester.gender,
                location: test.tester.location
            },
            skin_profile: {
                skin_type: test.tester.skinType,
                primary_concern: test.tester.primaryConcern,
                secondary_concerns: test.tester.secondaryConcerns,
                allergies: test.tester.allergies
            },
            testing_history: {
                reliability_score: test.tester.reliabilityScore
            }
        },
        feedback_entries: test.feedbackEntries.map((entry: any) => ({
            entry_id: entry.id,
            day_number: entry.day,
            actual_date: entry.date,
            data: entry.data ? JSON.parse(entry.data) : null
        }))
    }

    return NextResponse.json(exportData, { status: 200 })
}

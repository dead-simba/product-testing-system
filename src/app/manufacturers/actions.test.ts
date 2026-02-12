import { vi, describe, it, expect, beforeEach } from 'vitest'
import { archiveManufacturer, deleteManufacturer, unarchiveManufacturer } from './actions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

describe('Manufacturer Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should archive a manufacturer', async () => {
        const id = 'test-id'
        await archiveManufacturer(id)

        expect(prisma.manufacturer.update).toHaveBeenCalledWith({
            where: { id },
            data: { status: 'ARCHIVED' }
        })
        expect(revalidatePath).toHaveBeenCalledWith('/manufacturers')
    })

    it('should delete a manufacturer', async () => {
        const id = 'test-id'
        await deleteManufacturer(id)

        expect(prisma.manufacturer.delete).toHaveBeenCalledWith({
            where: { id }
        })
        expect(revalidatePath).toHaveBeenCalledWith('/manufacturers')
    })
})

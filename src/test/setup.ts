import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
    }),
    usePathname: () => '',
    revalidatePath: vi.fn(),
    redirect: vi.fn(),
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        tester: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        manufacturer: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        product: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    }
}))

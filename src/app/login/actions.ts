'use server'

import { cookies } from 'next/headers'

export async function login(password: string) {
    // Simple env-based password check
    // In a real app, use a more secure method or at least hash comparison
    // But for this single-user tool, simple string compare is requested
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (password === validPassword) {
        (await cookies()).set('auth_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        return { success: true }
    }

    return { success: false }
}

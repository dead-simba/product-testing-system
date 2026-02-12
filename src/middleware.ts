import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Define content that does not require auth
    const publicPaths = ['/login', '/favicon.ico']
    const isPublic = publicPaths.includes(request.nextUrl.pathname) ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/api/public')

    if (isPublic) {
        return NextResponse.next()
    }

    // Check for auth cookie
    const authCookie = request.cookies.get('auth_session')

    if (!authCookie) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

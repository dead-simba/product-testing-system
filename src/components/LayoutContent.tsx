'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

export function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'

    return (
        <>
            {!isLoginPage && <Sidebar />}
            <main className={`flex-1 min-h-screen transition-all duration-300 ${!isLoginPage ? 'ml-64 p-8' : 'p-0'}`}>
                {children}
            </main>
        </>
    )
}

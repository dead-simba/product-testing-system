'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Users,
    Package,
    FlaskConical,
    LayoutDashboard,
    BarChart3,
    Settings,
    Building2
} from 'lucide-react'

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Testers', href: '/testers', icon: Users },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Manufacturers', href: '/manufacturers', icon: Building2 },
    { name: 'Tests', href: '/tests', icon: FlaskConical },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white w-64 fixed left-0 top-0 border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-tight text-blue-400">PTS Admin</h1>
                <p className="text-xs text-slate-400 mt-1">Testing Management System</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                        AD
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">Admin User</p>
                        <p className="text-xs text-slate-400">Logged In</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

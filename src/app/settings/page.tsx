import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage system configuration.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Info</CardTitle>
                    <CardDescription>Current build information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between border-b py-2">
                        <span className="font-medium">Version</span>
                        <span className="text-muted-foreground">1.0.0 (MVP)</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span className="font-medium">Environment</span>
                        <span className="text-muted-foreground">{process.env.NODE_ENV}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="font-medium">Database</span>
                        <span className="text-muted-foreground">SQLite (Local)</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Admin password is managed via environment variables.</p>
                </CardContent>
            </Card>
        </div>
    )
}

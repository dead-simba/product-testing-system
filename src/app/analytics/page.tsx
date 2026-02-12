import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Deep dive into product performance data.</p>
            </div>

            <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium">Not Enough Data</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                        Analytics visualizations will become available once you have completed at least 5 testing cycles to ensure statistical relevance.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

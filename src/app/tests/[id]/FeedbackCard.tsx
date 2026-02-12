'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Edit2, Calendar, Play } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface FeedbackCardProps {
    entry: {
        id: string
        day: number
        date: Date
        data: string
        photos?: string | null
    }
    testId: string
}

export default function FeedbackCard({ entry, testId }: FeedbackCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const data = entry.data ? JSON.parse(entry.data) : {}

    return (
        <Card>
            <CardHeader className="py-4 bg-slate-50/50">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">Day {entry.day}</CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(entry.date), 'MMM d, h:mm a')}
                        </span>
                        <Link href={`/tests/${testId}/feedback/${entry.id}/edit`}>
                            <Button variant="ghost" size="sm" className="gap-1 h-8">
                                <Edit2 className="h-3 w-3" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="py-4 text-sm mt-2 space-y-3">
                {/* Summary View */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <span className="block text-xs text-muted-foreground">Satisfaction</span>
                        <span className="font-medium text-lg">
                            {data.user_experience?.satisfaction || '-'}{' '}
                            <span className="text-xs font-normal text-muted-foreground">/ 10</span>
                        </span>
                    </div>
                    <div>
                        <span className="block text-xs text-muted-foreground">Overall Improvement</span>
                        <span className="font-medium text-lg">
                            {data.effectiveness_metrics?.overall_improvement || '-'}{' '}
                            <span className="text-xs font-normal text-muted-foreground">/ 10</span>
                        </span>
                    </div>
                    <div>
                        <span className="block text-xs text-muted-foreground">Adverse Reactions</span>
                        <span className={`font-medium ${data.physical_response?.adverse_reaction === 'yes' ? 'text-red-600' : 'text-green-600'}`}>
                            {data.physical_response?.adverse_reaction === 'yes' ? 'Yes' : 'None'}
                        </span>
                    </div>
                    <div className="flex items-end justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="gap-1"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="h-4 w-4" />
                                    Hide Details
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-4 w-4" />
                                    View Details
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="pt-4 border-t space-y-6">
                        {/* Physical Response */}
                        {data.physical_response && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-blue-900">Physical Response</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Redness:</span>
                                        <span className="ml-2 font-medium capitalize">{data.physical_response.redness || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Dryness:</span>
                                        <span className="ml-2 font-medium capitalize">{data.physical_response.dryness || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Breakouts:</span>
                                        <span className="ml-2 font-medium capitalize">{data.physical_response.breakouts || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Irritation:</span>
                                        <span className="ml-2 font-medium capitalize">{data.physical_response.irritation || 'N/A'}</span>
                                    </div>
                                </div>
                                {data.physical_response.adverse_details && (
                                    <div className="mt-2">
                                        <span className="text-muted-foreground text-xs">Adverse Details:</span>
                                        <p className="text-sm mt-1 text-slate-700">{data.physical_response.adverse_details}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Effectiveness Metrics */}
                        {data.effectiveness_metrics && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-green-900">Effectiveness Metrics</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Hydration:</span>
                                        <span className="ml-2 font-medium">{data.effectiveness_metrics.hydration || '-'} / 10</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Brightness:</span>
                                        <span className="ml-2 font-medium">{data.effectiveness_metrics.brightness || '-'} / 10</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Texture:</span>
                                        <span className="ml-2 font-medium">{data.effectiveness_metrics.texture || '-'} / 10</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Pore Appearance:</span>
                                        <span className="ml-2 font-medium">{data.effectiveness_metrics.pore_appearance || '-'} / 10</span>
                                    </div>
                                </div>
                                {data.effectiveness_metrics.specific_observations && (
                                    <div className="mt-2">
                                        <span className="text-muted-foreground text-xs">Observations:</span>
                                        <p className="text-sm mt-1 text-slate-700">{data.effectiveness_metrics.specific_observations}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* User Experience */}
                        {data.user_experience && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-purple-900">User Experience</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Texture Feel:</span>
                                        <span className="ml-2 font-medium capitalize">{data.user_experience.texture || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Scent:</span>
                                        <span className="ml-2 font-medium capitalize">{data.user_experience.scent || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Absorption:</span>
                                        <span className="ml-2 font-medium capitalize">{data.user_experience.absorption || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Ease of Use:</span>
                                        <span className="ml-2 font-medium">{data.user_experience.ease_of_use || '-'} / 10</span>
                                    </div>
                                </div>
                                {data.user_experience.notes && (
                                    <div className="mt-2">
                                        <span className="text-muted-foreground text-xs">Experience Notes:</span>
                                        <p className="text-sm mt-1 text-slate-700">{data.user_experience.notes}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Emotional Read */}
                        {data.emotional_read && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-orange-900">Emotional Read</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Confidence:</span>
                                        <span className="ml-2 font-medium">{data.emotional_read.confidence || '-'} / 10</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Mood Impact:</span>
                                        <span className="ml-2 font-medium capitalize">{data.emotional_read.mood_impact || 'N/A'}</span>
                                    </div>
                                </div>
                                {data.emotional_read.overall_feeling && (
                                    <div className="mt-2">
                                        <span className="text-muted-foreground text-xs">Overall Feeling:</span>
                                        <p className="text-sm mt-1 text-slate-700">{data.emotional_read.overall_feeling}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Admin Notes */}
                        {data.admin_notes && (
                            <div className="pt-2 border-t">
                                <span className="block text-xs text-muted-foreground mb-1 font-semibold">Admin Notes:</span>
                                <p className="text-sm text-slate-700 italic">"{data.admin_notes}"</p>
                            </div>
                        )}

                        {/* Media Gallery */}
                        {entry.photos && JSON.parse(entry.photos).length > 0 && (
                            <div className="pt-4 border-t space-y-2">
                                <h4 className="font-semibold text-sm text-slate-900">Photos & Videos</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {JSON.parse(entry.photos).map((url: string, idx: number) => {
                                        const isVideo = url.endsWith('.mp4') || url.endsWith('.mov') || url.includes('/video/upload/');
                                        return (
                                            <div key={idx} className="aspect-square rounded-lg overflow-hidden border bg-slate-100 relative group cursor-pointer hover:border-blue-500 transition-all">
                                                {isVideo ? (
                                                    <>
                                                        <video src={url} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                                            <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                                <Play className="h-4 w-4 fill-slate-900 ml-0.5" />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <img src={url} alt={`Feedback ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                )}
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 z-10"
                                                    title="View full size"
                                                ></a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

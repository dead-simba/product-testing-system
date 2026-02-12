'use client'

import { useState, useRef } from 'react'
import { ImagePlus, X, Play, FileIcon } from 'lucide-react'
import { Button } from './ui/button'

interface MediaUploadProps {
    name: string
    existingPhotos?: string[]
}

export function MediaUpload({ name, existingPhotos = [] }: MediaUploadProps) {
    const [previews, setPreviews] = useState<string[]>([])
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setSelectedFiles(prev => [...prev, ...files])

        const newPreviews = files.map(file => URL.createObjectURL(file))
        setPreviews(prev => [...prev, ...newPreviews])
    }

    const removeSelectedFile = (index: number) => {
        URL.revokeObjectURL(previews[index])
        setPreviews(prev => prev.filter((_, i) => i !== index))

        const newFiles = selectedFiles.filter((_, i) => i !== index)
        setSelectedFiles(newFiles)

        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer()
            newFiles.forEach(file => dataTransfer.items.add(file))
            fileInputRef.current.files = dataTransfer.files
        }
    }

    return (
        <div className="space-y-4">
            <div
                className="p-8 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 transition-colors cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
            >
                <ImagePlus className="h-10 w-10 text-slate-400" />
                <div className="text-center">
                    <p className="text-sm font-medium">Click to upload progress images or videos</p>
                    <p className="text-xs text-muted-foreground">You can select multiple files</p>
                </div>
                <input
                    type="file"
                    name={name}
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            {/* Selection Info */}
            {selectedFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <FileIcon className="h-4 w-4" />
                    {selectedFiles.length} file(s) selected for upload
                </div>
            )}

            {/* Previews of NEW files */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {previews.map((url, idx) => {
                        const file = selectedFiles[idx];
                        const isVideo = file?.type.startsWith('video/');
                        return (
                            <div key={idx} className="aspect-square rounded-md overflow-hidden border bg-white relative group">
                                {isVideo ? (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                        <Play className="h-6 w-6 text-slate-400" />
                                    </div>
                                ) : (
                                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                )}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSelectedFile(idx);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Existing Photos (if any - for Edit mode) */}
            {existingPhotos.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Already Attached</p>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {existingPhotos.map((url: string, idx: number) => (
                            <div key={idx} className="aspect-square rounded-md overflow-hidden border bg-white relative">
                                {url.endsWith('.mp4') || url.endsWith('.mov') || url.includes('/video/upload/') ? (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                        <Play className="h-6 w-6 text-slate-400" />
                                    </div>
                                ) : (
                                    <img src={url} alt={`Feedback ${idx}`} className="w-full h-full object-cover" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

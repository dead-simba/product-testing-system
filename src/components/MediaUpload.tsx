'use client'

import { useState, useRef } from 'react'
import { ImagePlus, X, Play, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface MediaUploadProps {
    name: string
    existingPhotos?: string[]
}

interface UploadingFile {
    file: File
    preview: string
    progress: number
    url?: string
    error?: string
}

export function MediaUpload({ name, existingPhotos = [] }: MediaUploadProps) {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
    const [finalUrls, setFinalUrls] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        const startIndex = uploadingFiles.length
        const newUploading = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0
        }))

        setUploadingFiles(prev => [...prev, ...newUploading])

        // Start upload for each file
        newUploading.forEach((uploadItem, index) => {
            uploadFile(uploadItem, startIndex + index)
        })

        // Reset input so same file can be selected again if removed
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const uploadFile = (item: UploadingFile, index: number) => {
        if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name' || uploadPreset === 'your_upload_preset') {
            setUploadingFiles(prev => {
                const updated = [...prev]
                if (updated[index]) updated[index].error = 'Cloudinary not configured'
                return updated
            })
            return
        }

        const formData = new FormData()
        formData.append('file', item.file)
        formData.append('upload_preset', uploadPreset)

        const xhr = new XMLHttpRequest()
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`)

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100)
                setUploadingFiles(prev => {
                    const updated = [...prev]
                    if (updated[index]) updated[index].progress = progress
                    return updated
                })
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText)
                const url = response.secure_url

                setUploadingFiles(prev => {
                    const updated = [...prev]
                    if (updated[index]) updated[index].url = url
                    return updated
                })

                setFinalUrls(prev => [...prev, url])
            } else {
                setUploadingFiles(prev => {
                    const updated = [...prev]
                    if (updated[index]) updated[index].error = 'Upload failed'
                    return updated
                })
            }
        }

        xhr.onerror = () => {
            setUploadingFiles(prev => {
                const updated = [...prev]
                if (updated[index]) updated[index].error = 'Network error'
                return updated
            })
        }

        xhr.send(formData)
    }

    const removeFile = (index: number) => {
        const item = uploadingFiles[index]
        if (item.preview) URL.revokeObjectURL(item.preview)

        if (item.url) {
            setFinalUrls(prev => prev.filter(u => u !== item.url))
        }

        setUploadingFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-4">
            {/* Hidden Input to send URLs back to server action */}
            <input type="hidden" name="photos_json" value={JSON.stringify(finalUrls)} />

            <div
                className="p-8 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 transition-colors cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
            >
                <ImagePlus className="h-10 w-10 text-slate-400" />
                <div className="text-center">
                    <p className="text-sm font-medium">Click to upload progress images or videos</p>
                    <p className="text-xs text-muted-foreground">Directly to cloud (No size limits)</p>
                </div>
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            {/* Error Message if not configured */}
            {(!cloudName || cloudName === 'your_cloud_name') && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    <AlertCircle className="h-4 w-4" />
                    <span>Cloudinary credentials missing in .env. Please add Cloud Name and Upload Preset.</span>
                </div>
            )}

            {/* Uploading/Selected Files Grid */}
            {uploadingFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {uploadingFiles.map((item, idx) => {
                        const isVideo = item.file.type.startsWith('video/')
                        return (
                            <div key={idx} className="aspect-square rounded-lg overflow-hidden border bg-slate-50 relative group">
                                {isVideo ? (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                        <Play className="h-8 w-8 text-slate-400 opacity-50" />
                                    </div>
                                ) : (
                                    <img src={item.preview} className="w-full h-full object-cover" alt="Upload preview" />
                                )}

                                {/* Progress/Status Overlay */}
                                <div className={`absolute inset-0 flex flex-col items-center justify-center p-2 transition-colors ${item.url ? 'bg-black/20' : 'bg-black/50'}`}>
                                    {item.url ? (
                                        <CheckCircle2 className="h-10 w-10 text-green-400 shadow-sm" />
                                    ) : item.error ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <AlertCircle className="h-8 w-8 text-red-400" />
                                            <p className="text-[10px] text-red-200 text-center font-bold px-1 leading-tight">{item.error}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                                            <p className="text-xs text-white mt-2 font-black drop-shadow-md">{item.progress}%</p>
                                        </>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors z-10"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Already Attached (for Edit mode) */}
            {existingPhotos.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Already Attached</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {existingPhotos.map((url: string, idx: number) => {
                            const isExistingVideo = url.endsWith('.mp4') || url.endsWith('.mov') || url.includes('/video/upload/');
                            return (
                                <div key={idx} className="aspect-square rounded-md overflow-hidden border bg-white opacity-60">
                                    {isExistingVideo ? (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                            <Play className="h-5 w-5 text-slate-400" />
                                        </div>
                                    ) : (
                                        <img src={url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

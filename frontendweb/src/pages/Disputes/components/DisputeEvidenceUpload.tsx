import { useState, useCallback, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface DisputeEvidenceUploadProps {
  disputeId: string
  onUploadComplete?: (files: File[]) => void
}

interface FileWithPreview {
  file: File
  preview: string
  progress: number
}

const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function DisputeEvidenceUpload({ onUploadComplete }: DisputeEvidenceUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((fileList: FileList) => {
    setError(null)
    const newFiles = Array.from(fileList)

    if (files.length + newFiles.length > MAX_FILES) {
      setError(`You can upload up to ${MAX_FILES} images`)
      return
    }

    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        return false
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`Each file must be under 10MB`)
        return false
      }
      return true
    })

    const fileObjects: FileWithPreview[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...fileObjects])

    fileObjects.forEach((fileObj) => {
      simulateUpload(fileObj.file.name, (progress) => {
        setFiles((prev) =>
          prev.map((f) => (f.file.name === fileObj.file.name ? { ...f, progress } : f))
        )
      })
    })
  }, [files.length])

  const simulateUpload = (_fileName: string, onProgress: (p: number) => void) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      onProgress(Math.min(100, Math.round(progress)))
    }, 300)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev]
      if (updated[index]) {
        URL.revokeObjectURL(updated[index].preview)
      }
      updated.splice(index, 1)
      return updated
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
    e.target.value = ''
  }

  const handleSubmit = () => {
    const completedFiles = files.filter((f) => f.progress === 100).map((f) => f.file)
    onUploadComplete?.(completedFiles)
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors',
          isDragging
            ? 'border-brand-400 bg-brand-50'
            : 'border-surface-200 bg-surface-50 hover:border-brand-300 hover:bg-brand-50/50',
        )}
      >
        <Upload className={cn('h-8 w-8 mb-2', isDragging ? 'text-brand-500' : 'text-surface-400')} />
        <p className="text-sm font-medium text-surface-600">
          Drop photos here or click to browse
        </p>
        <p className="mt-1 text-xs text-surface-400">
          Max {MAX_FILES} images, 10MB each
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {files.map((file, index) => (
            <div key={file.preview} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg bg-surface-100">
                <img
                  src={file.preview}
                  alt={`Upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {file.progress < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                  <div className="text-center">
                    <div className="h-8 w-8 mx-auto rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <p className="mt-1 text-xs font-medium text-white">{file.progress}%</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={files.some((f) => f.progress < 100)}
        >
          Upload {files.filter((f) => f.progress === 100).length} of {files.length} Files
        </Button>
      )}
    </div>
  )
}

"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { uploadImage } from "@/lib/actions/admin"

type ImagePickerProps = {
  name: string
  bucket: "products" | "vehicles" | "materials" | "hero-slides"
  value?: string[]
  multiple?: boolean
  onChange?: (urls: string[]) => void
}

export function ImagePicker({ name, bucket, value = [], multiple = true, onChange }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [urls, setUrls] = useState(value)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setError(null)
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("bucket", bucket)
        uploaded.push(await uploadImage(formData))
        if (!multiple) break
      }
      const next = multiple ? [...urls, ...uploaded] : uploaded
      setUrls(next)
      onChange?.(next)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function remove(url: string) {
    const next = urls.filter((item) => item !== url)
    setUrls(next)
    onChange?.(next)
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={urls.join(",")} />
      <div className="flex flex-wrap gap-3">
        {urls.map((url) => (
          <div key={url} className="relative h-20 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <img src={url} alt="Uploaded preview" className="h-full w-full object-cover" />
            <button type="button" onClick={() => remove(url)} aria-label="Remove uploaded image" className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-ksk-gold hover:text-ksk-dark disabled:opacity-60">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          {uploading ? "Uploading" : "Browse"}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={multiple} onChange={(event) => handleFiles(event.target.files)} className="sr-only" />
      <p className="text-xs text-gray-500">Choose {multiple ? "one or more" : "an"} image{multiple ? "s" : ""} from your computer. Images are stored in Supabase Storage.</p>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

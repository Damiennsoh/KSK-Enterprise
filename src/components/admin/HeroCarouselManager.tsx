"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { createHeroSlide, deleteHeroSlide, toggleHeroSlide, updateHeroSlide } from "@/lib/actions/admin"
import { Plus, Save, Trash2, Eye, EyeOff } from "lucide-react"

type Slide = { id: string; eyebrow: string; title: string; description: string; cta_label: string; cta_href: string; image_url: string; display_order: number; is_active: boolean }

const empty: Omit<Slide, "id"> = { eyebrow: "", title: "", description: "", cta_label: "Explore", cta_href: "/", image_url: "/images/hero/construction.png", display_order: 1, is_active: true }

export function HeroCarouselManager() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [draft, setDraft] = useState<Omit<Slide, "id"> | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from("hero_slides").select("*").order("display_order", { ascending: true })
    setSlides((data as Slide[]) ?? [])
  }

  useEffect(() => { load() }, [])

  function formData(value: Omit<Slide, "id">) {
    const data = new FormData()
    Object.entries(value).forEach(([key, item]) => data.set(key, String(item)))
    return data
  }

  async function save() {
    if (!draft || !draft.title || !draft.image_url) return
    setSaving(true)
    try { await createHeroSlide(formData(draft)); setDraft(null); await load() } finally { setSaving(false) }
  }

  async function saveExisting(slide: Slide) {
    const data = formData(slide)
    await updateHeroSlide(slide.id, data)
    await load()
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this hero slide?")) return
    await deleteHeroSlide(id)
    await load()
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-ksk-dark">Hero carousel</h2><p className="mt-1 text-sm text-gray-500">Manage the images and messages shown on the homepage.</p></div>
        <button type="button" onClick={() => setDraft({ ...empty, display_order: slides.length + 1 })} className="flex items-center gap-2 rounded-lg bg-ksk-gold px-4 py-2 text-sm font-semibold text-ksk-dark"><Plus className="h-4 w-4" />Add slide</button>
      </div>
      <div className="grid gap-4">
        {draft && <SlideEditor value={draft} onChange={setDraft} onSave={save} saving={saving} onCancel={() => setDraft(null)} />}
        {slides.map((slide) => <SlideEditor key={slide.id} value={slide} onChange={(value) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, ...value } : item))} onSave={() => saveExisting(slide)} onCancel={() => load()} onDelete={() => remove(slide.id)} onToggle={() => toggleHeroSlide(slide.id, !slide.is_active).then(load)} />)}
      </div>
    </div>
  )
}

function SlideEditor({ value, onChange, onSave, onCancel, onDelete, onToggle, saving }: { value: Omit<Slide, "id"> | Slide; onChange: (value: any) => void; onSave: () => void; onCancel: () => void; onDelete?: () => void; onToggle?: () => void; saving?: boolean }) {
  const field = (key: keyof Omit<Slide, "id">, label: string, wide = false) => <label className={wide ? "sm:col-span-2" : ""}><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span><input value={String(value[key])} onChange={(event) => onChange({ ...value, [key]: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-ksk-gold focus:outline-none" /></label>
  return <div className="grid gap-3 rounded-lg border border-gray-200 p-4 sm:grid-cols-2"><div className="flex gap-3 sm:col-span-2"><img src={value.image_url} alt="" className="h-20 w-32 rounded object-cover" /><div className="flex-1 text-sm text-gray-500">Use a high-resolution image URL or a local asset path. Recommended ratio: 16:9.</div></div>{field("eyebrow", "Eyebrow")}{field("title", "Title")}{field("cta_label", "Button label")}{field("cta_href", "Button link")}{field("image_url", "Image URL", true)}{field("display_order", "Order")}{field("description", "Description", true)}<div className="flex flex-wrap justify-end gap-2 sm:col-span-2"><button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">Cancel</button>{onToggle && <button type="button" onClick={onToggle} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">{value.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}{value.is_active ? "Hide" : "Show"}</button>}{onDelete && <button type="button" onClick={onDelete} className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"><Trash2 className="h-4 w-4" />Delete</button>}<button type="button" disabled={saving} onClick={onSave} className="flex items-center gap-2 rounded-lg bg-ksk-dark px-4 py-2 text-sm font-semibold text-white"><Save className="h-4 w-4" />{saving ? "Saving..." : "Save slide"}</button></div></div>
}

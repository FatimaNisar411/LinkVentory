import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface EditLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, title: string, url: string, category: string, note?: string) => void
  categories?: string[]
  linkData: {
    _id: string
    title: string
    url: string
    category: string
    note?: string
  } | null
}

export function EditLinkDialog({ 
  open, 
  onOpenChange, 
  onUpdate, 
  categories = [], 
  linkData 
}: EditLinkDialogProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")

  const availableCategories = categories.filter(cat => cat !== "All")

  // Update form when linkData changes
  useEffect(() => {
    if (linkData) {
      setTitle(linkData.title)
      setUrl(linkData.url)
      setCategory(linkData.category)
      setNote(linkData.note || "")
    }
  }, [linkData])

  const handleSubmit = () => {
    if (title && url && category && linkData) {
      onUpdate(linkData._id, title, url, category, note || undefined)
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    if (linkData) {
      setTitle(linkData.title)
      setUrl(linkData.url)
      setCategory(linkData.category)
      setNote(linkData.note || "")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="URL*"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Input
            placeholder="Category* (Type new or select existing)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="edit-categories"
            required
          />
          <datalist id="edit-categories">
            {availableCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          <Input
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!title || !url || !category}
            >
              Update Link
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

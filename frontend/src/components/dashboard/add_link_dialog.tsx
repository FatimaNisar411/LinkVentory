
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useState } from "react"

interface AddLinkDialogProps {
  onAdd: (title: string, url: string, category: string, note?: string) => void
  categories?: string[]
}

export function AddLinkDialog({ onAdd, categories = [] }: AddLinkDialogProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")
  const [open, setOpen] = useState(false)

  const availableCategories = categories.filter(cat => cat !== "All")

  const handleSubmit = () => {
    if (title && url && category) {
      onAdd(title, url, category, note || undefined)
      setTitle("")
      setUrl("")
      setCategory("")
      setNote("")
      setOpen(false) // Close dialog after successful add
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Link</DialogTitle>
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
            list="categories"
            required
          />
          <datalist id="categories">
            {availableCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          <Input
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!title || !url || !category}
          >
            Add Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

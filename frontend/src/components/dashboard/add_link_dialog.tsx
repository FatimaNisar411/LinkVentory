
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useState } from "react"

interface AddLinkDialogProps {
  onAdd: (title: string, url: string) => void
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = () => {
    if (title && url) {
      onAdd(title, url)
      setTitle("")
      setUrl("")
    }
  }

  return (
    <Dialog>
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
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleSubmit} className="w-full">
            Add Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

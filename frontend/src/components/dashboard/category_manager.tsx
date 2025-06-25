import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings, Trash2 } from "lucide-react"
import { useState } from "react"

interface Category {
  id: string
  name: string
}

interface CategoryManagerProps {
  categories: Category[]
  onDeleteCategory: (categoryId: string, categoryName: string) => void
}

export function CategoryManager({ categories, onDeleteCategory }: CategoryManagerProps) {
  const [open, setOpen] = useState(false)
  
  // Filter out "All" and only show actual categories
  const managedCategories = categories.filter(cat => cat.name !== "All")

  const handleDelete = (category: Category) => {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?\n\nThis will remove the category from all associated links.`)) {
      onDeleteCategory(category.id, category.name)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Settings className="w-4 h-4 mr-2" />
          Manage Categories
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        
        {managedCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No categories to manage
          </div>
        ) : (
          <div className="space-y-2">
            {managedCategories.map((category) => (
              <div 
                key={category.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{category.name}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
          <strong>Note:</strong> Deleting a category will remove it from all associated links, but the links themselves will remain.
        </div>
      </DialogContent>
    </Dialog>
  )
}

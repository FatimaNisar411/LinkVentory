import { useState, useEffect } from "react"
import { WelcomeCard } from "@/components/dashboard/welcome_card"
import CategorySelector from "@/components/dashboard/category_selector"
import SortSelector, { SortOption } from "@/components/dashboard/sort_selector"
import SearchBar from "@/components/dashboard/search_bar"
import LinkCard  from "@/components/dashboard/link_card"
import { AddLinkDialog } from "@/components/dashboard/add_link_dialog"
import { EditLinkDialog } from "@/components/dashboard/edit_link_dialog"
import LoadingSpinner from "@/components/ui/loading-spinner"
import AnalyticsChart from "@/components/dashboard/analytics_chart"
import { searchLinks } from "@/lib/search"
import { getLinks, getLinksForCategory, getCategories, createLink, createCategory, updateLink, deleteLink, deleteCategory, getCurrentUser, Link as ApiLink, Category, User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

interface Link {
  _id: string
  title: string
  url: string
  category: string
  note?: string // Optional note field
  timestamp: number // Timestamp in milliseconds
}



export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSort, setSelectedSort] = useState<SortOption>("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [links, setLinks] = useState<Link[]>([]) // Current filtered links
  const [totalLinks, setTotalLinks] = useState(0) // Total links for stats
  const [categoriesData, setCategoriesData] = useState<Category[]>([]) // Full category objects
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Create categories for selector (includes "All" + category objects)
  const categoriesForSelector: (Category | string)[] = ["All", ...categoriesData]
  const categoryNames = ["All", ...categoriesData.map(cat => cat.name)]

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Load links when category changes
  useEffect(() => {
    if (categoriesData.length > 0) { // Only load if categories are already loaded
      loadLinksForCategory()
    }
  }, [selectedCategory])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load user, all links, and categories to get total stats
      const [userData, allLinksData, categoriesData] = await Promise.all([
        getCurrentUser(),
        getLinks(), // Get ALL links for stats
        getCategories()
      ])

      setUser(userData)
      setTotalLinks(allLinksData.length) // Set total count for stats
      
      // Set categories
      setCategoriesData(categoriesData) // Store full category objects

      // Load links for "All" category initially (this will set the `links` state)
      await loadLinksForCategory("All", categoriesData)
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('authentication')) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }
      
      toast({
        title: "Failed to load data",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadLinksForCategory = async (category?: string, categoriesData?: Category[]) => {
    try {
      const targetCategory = category || selectedCategory

      let linksData: ApiLink[]
      
      if (targetCategory === "All") {
        // Get all links
        linksData = await getLinks()
      } else {
        // Get category data if not provided
        if (!categoriesData) {
          categoriesData = await getCategories()
        }
        
        // Find the category ID (handle both 'id' and '_id' fields)
        const categoryObj = categoriesData.find(cat => cat.name === targetCategory)
        
        if (categoryObj) {
          const categoryId = (categoryObj as any).id || (categoryObj as any)._id || categoryObj.id
          
          if (categoryId && categoryId !== 'undefined') {
            // Use the backend endpoint to get links for this specific category
            linksData = await getLinksForCategory(categoryId)
          } else {
            console.error('Category ID is undefined for category:', categoryObj)
            linksData = []
          }
        } else {
          console.warn('Category not found:', targetCategory)
          linksData = []
        }
      }

      // Create a map of category ID to category name (if we have categoriesData)
      let categoryMap = new Map<string, string>()
      if (categoriesData) {
        categoriesData.forEach(cat => {
          const catId = (cat as any).id || (cat as any)._id || cat.id
          if (catId) {
            categoryMap.set(catId, cat.name)
          }
        })
      } else {
        // Fetch categories if we don't have them
        const cats = await getCategories()
        cats.forEach(cat => {
          const catId = (cat as any).id || (cat as any)._id || cat.id
          if (catId) {
            categoryMap.set(catId, cat.name)
          }
        })
      }
      
      // Convert API data to our Link interface
      const convertedLinks: Link[] = linksData.map((apiLink: ApiLink) => {
        const categoryName = apiLink.category_id ? categoryMap.get(apiLink.category_id) || "Uncategorized" : "Uncategorized"
        // Handle both 'id' and '_id' fields from the API
        const linkId = (apiLink as any).id || (apiLink as any)._id || apiLink.id
        
        return {
          _id: linkId,
          title: apiLink.title,
          url: apiLink.url,
          category: categoryName,
          note: apiLink.note,
          timestamp: new Date(apiLink.created_at).getTime()
        }
      })
      
      setLinks(convertedLinks)
      
    } catch (error) {
      console.error('Failed to load links for category:', error)
      toast({
        title: "Failed to load links",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const refreshTotalStats = async () => {
    try {
      const [allLinksData, categoriesData] = await Promise.all([
        getLinks(),
        getCategories()
      ])
      setTotalLinks(allLinksData.length)
      setCategoriesData(categoriesData)
    } catch (error) {
      console.error('Failed to refresh total stats:', error)
    }
  }

  // Apply search to current links (no category filtering needed since server handles it)
  const searchFilteredLinks = searchLinks(links, searchQuery)

  // Finally sort the results
  const sortedLinks = [...searchFilteredLinks].sort((a, b) => {
    if (selectedSort === "recent") {
      return b.timestamp - a.timestamp // Most recent first
    } else {
      return a.title.localeCompare(b.title) // Alphabetical A to Z
    }
  })

  const handleAddLink = async (title: string, url: string, category: string, note?: string) => {
    try {
      // Check if category exists, create if it doesn't
      let categoryId: string | undefined = undefined
      
      if (category !== "Uncategorized") {
        if (!categoryNames.includes(category)) {
          // Create new category
          try {
            const newCategory = await createCategory(category)
            categoryId = (newCategory as any).id || (newCategory as any)._id || newCategory.id
            
            // Add the new category to our local state
            setCategoriesData(prev => [...prev, newCategory])
          } catch (error) {
            console.error('Failed to create category:', error)
          }
        } else {
          // Find the category ID for existing category
          const existingCategory = categoriesData.find(cat => cat.name === category)
          if (existingCategory) {
            categoryId = (existingCategory as any).id || (existingCategory as any)._id || existingCategory.id
          }
        }
      }
      
      // Create link via API
      const newApiLink = await createLink({
        title,
        url,
        note,
        category_id: categoryId
      })
      
      // Reload current category view and refresh total stats
      await Promise.all([
        loadLinksForCategory(),
        refreshTotalStats()
      ])
      
      toast({
        title: "Link added successfully!",
        description: `"${title}" has been added to your collection.`,
      })
      
    } catch (error) {
      console.error('Failed to add link:', error)
      toast({
        title: "Failed to add link",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditLink = (link: Link) => {
    setEditingLink(link)
    setEditDialogOpen(true)
  }

  const handleUpdateLink = async (id: string, title: string, url: string, category: string, note?: string) => {
    try {
      // Check if category exists, create if it doesn't
      let categoryId: string | undefined = undefined
      
      if (category !== "Uncategorized") {
        if (!categoryNames.includes(category)) {
          // Create new category
          try {
            const newCategory = await createCategory(category)
            categoryId = (newCategory as any).id || (newCategory as any)._id || newCategory.id
            
            // Add the new category to our local state
            setCategoriesData(prev => [...prev, newCategory])
          } catch (error) {
            console.error('Failed to create category:', error)
          }
        } else {
          // Find the category ID for existing category
          const existingCategory = categoriesData.find(cat => cat.name === category)
          if (existingCategory) {
            categoryId = (existingCategory as any).id || (existingCategory as any)._id || existingCategory.id
          }
        }
      }

      // Update link via API
      const updatedApiLink = await updateLink(id, {
        title,
        url,
        note,
        category_id: categoryId
      })

      // Reload current category view and refresh total stats
      await Promise.all([
        loadLinksForCategory(),
        refreshTotalStats()
      ])

      toast({
        title: "Link updated successfully!",
        description: `"${title}" has been updated.`,
      })

    } catch (error) {
      console.error('Failed to update link:', error)
      toast({
        title: "Failed to update link",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLink = async (link: Link) => {
    if (confirm(`Are you sure you want to delete "${link.title}"?`)) {
      try {
        await deleteLink(link._id)
        
        // Reload current category view and refresh total stats
        await Promise.all([
          loadLinksForCategory(),
          refreshTotalStats()
        ])
        
        toast({
          title: "Link deleted successfully!",
          description: `"${link.title}" has been removed.`,
        })
        
      } catch (error) {
        console.error('Failed to delete link:', error)
        toast({
          title: "Failed to delete link",
          description: "Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    try {
      const categoryId = (category as any).id || (category as any)._id || category.id
      
      await deleteCategory(categoryId)
      
      // If we're currently viewing the deleted category, switch to "All"
      if (selectedCategory === category.name) {
        setSelectedCategory("All")
      }
      
      // Remove from local state
      setCategoriesData(prev => prev.filter(cat => cat.name !== category.name))
      
      // Refresh all data
      await Promise.all([
        loadLinksForCategory("All"), // Load all links since category filter might have changed
        refreshTotalStats()
      ])
      
      toast({
        title: "Category deleted successfully!",
        description: `"${category.name}" and its links have been removed.`,
      })
      
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast({
        title: "Failed to delete category",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  function getMostUsedCategory(): string {
    const counts: Record<string, number> = {};
    links.forEach((l) => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "None";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <WelcomeCard
        name={user?.name || "User"}
        totalLinks={totalLinks}
        totalCategories={categoriesData.length}
      />

      {/* Search and Filters Section */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search links, notes, URLs..."
          resultCount={sortedLinks.length}
          totalCount={links.length}
        />
        
        <div className="flex flex-wrap items-center gap-4">
          <CategorySelector
            categories={categoriesForSelector}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            onDeleteCategory={handleDeleteCategory}
          />

          <SortSelector
            selected={selectedSort}
            onSelect={setSelectedSort}
          />
        </div>
      </div>

      {/* 🔗 Link Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedLinks.map((link) => (
          <LinkCard
            key={link._id}
            _id={link._id}
            title={link.title}
            url={link.url}
            note={link.note}
            timestamp={link.timestamp}
            onEdit={() => handleEditLink(link)}
            onDelete={() => handleDeleteLink(link)}
          />
        ))}
      </div>

      <AddLinkDialog onAdd={handleAddLink} categories={categoryNames} />
      <EditLinkDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleUpdateLink}
        categories={categoryNames}
        linkData={editingLink}
      />
    </div>
  );
}



import { useState } from "react"
import { WelcomeCard } from "@/components/dashboard/welcome_card"
import CategorySelector from "@/components/dashboard/category_selector"
import SortSelector, { SortOption } from "@/components/dashboard/sort_selector"
import SearchBar from "@/components/dashboard/search_bar"
import LinkCard  from "@/components/dashboard/link_card"
import { AddLinkDialog } from "@/components/dashboard/add_link_dialog"
import AnalyticsChart from "@/components/dashboard/analytics_chart"
import { searchLinks } from "@/lib/search";

interface Link {
  _id: string
  title: string
  url: string
  category: string
  note?: string // Optional note field
  timestamp: number // Timestamp in milliseconds
}

const dummyLinks: Link[] = [
  {
    _id: "1",
    title: "React Docs",
    url: "https://reactjs.org",
    category: "Dev",
    note: "Official documentation for React. Essential for understanding hooks and components.",
    timestamp: 1719225600000, // June 24, 2025, 1:00:00 PM PKT
  },
  {
    _id: "2",
    title: "YouTube",
    url: "https://www.youtube.com/", // Changed URL to a generic YouTube link
    category: "Media",
    note: "Primary platform for video content. Good for tutorials and entertainment.",
    timestamp: 1719225700000, // June 24, 2025, 1:01:40 PM PKT
  },
  {
    _id: "3", // New ID
    title: "Awesome CSS Tricks",
    url: "https://css-tricks.com/",
    category: "Dev",
    note: "A fantastic resource for learning modern CSS techniques and tips. Highly recommended for frontend developers!",
    timestamp: 1719225800000, // June 24, 2025, 1:03:20 PM PKT - This will appear 'most recent' if sorted
  },
  // Adding one more link for variety
  {
    _id: "4",
    title: "FastAPI Official Docs",
    url: "https://fastapi.tiangolo.com/",
    category: "Dev",
    note: "The official documentation for FastAPI. Very comprehensive and well-written.",
    timestamp: 1719225850000, // June 24, 2025, 1:04:10 PM PKT
  },
  {
    _id: "5",
    title: "Shadcn UI Showcase",
    url: "https://ui.shadcn.com/docs",
    category: "Dev",
    // This link intentionally has NO note, so its button won't appear
    timestamp: 1719225900000, // June 24, 2025, 1:05:00 PM PKT
  },
];

// const dummyLinks: Link[] = [
//   { _id: "1", title: "React Docs", url: "https://reactjs.org", category: "Dev" },
//   { _id: "2", title: "YouTube", url: "https://youtube.com", category: "Media" },
// ]

const categories = ["All", "Dev", "Media"]

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSort, setSelectedSort] = useState<SortOption>("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [links, setLinks] = useState<Link[]>(dummyLinks)

  // First filter by category
  const categoryFilteredLinks =
    selectedCategory === "All"
      ? links
      : links.filter((link) => link.category === selectedCategory)

  // Then apply search
  const searchFilteredLinks = searchLinks(categoryFilteredLinks, searchQuery)

  // Finally sort the results
  const sortedLinks = [...searchFilteredLinks].sort((a, b) => {
    if (selectedSort === "recent") {
      return b.timestamp - a.timestamp // Most recent first
    } else {
      return a.title.localeCompare(b.title) // Alphabetical A to Z
    }
  })

  const handleAddLink = (title: string, url: string) => {
    const newLink: Link = {
      _id: Date.now().toString(),
      title,
      url,
      category: selectedCategory === "All" ? "Uncategorized" : selectedCategory,
      timestamp: Date.now()
    }
    setLinks((prev) => [...prev, newLink])
  }
  return (
  <div className="p-6 space-y-6">
    <WelcomeCard
      name="Fatima"
      totalLinks={links.length}
      totalCategories={categories.length - 1}
    />

    {/* Search and Filters Section */}
    <div className="space-y-4">      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search links, notes, URLs..."
        resultCount={sortedLinks.length}
        totalCount={links.length}
      />
      
      <div className="flex flex-wrap items-center gap-4">
        <CategorySelector
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
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
          onEdit={() => console.log("Edit", link._id)}
          onDelete={() => console.log("Delete", link._id)}
        />
      ))}
    </div>



    <AddLinkDialog onAdd={handleAddLink} />
  </div>
);


  function getMostUsedCategory(): string {
  const counts: Record<string, number> = {};
  links.forEach((l) => {
    counts[l.category] = (counts[l.category] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "None";
}

}



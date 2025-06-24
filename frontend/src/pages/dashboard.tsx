import { useState } from "react"
import { WelcomeCard } from "@/components/dashboard/welcome_card"
import CategorySelector from "@/components/dashboard/category_selector"
import AnalyticsCard from "@/components/dashboard/analytics_chart";

import LinkCard  from "@/components/dashboard/link_card"
import { AddLinkDialog } from "@/components/dashboard/add_link_dialog"
import AnalyticsChart from "@/components/dashboard/analytics_chart";

interface Link {
  _id: string
  title: string
  url: string
  category: string
}

const dummyLinks: Link[] = [
  { _id: "1", title: "React Docs", url: "https://reactjs.org", category: "Dev" },
  { _id: "2", title: "YouTube", url: "https://youtube.com", category: "Media" },
]

const categories = ["All", "Dev", "Media"]

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [links, setLinks] = useState<Link[]>(dummyLinks)

  const filteredLinks =
    selectedCategory === "All"
      ? links
      : links.filter((link) => link.category === selectedCategory)

  const handleAddLink = (title: string, url: string) => {
    const newLink: Link = {
      _id: Date.now().toString(),
      title,
      url,
      category: selectedCategory === "All" ? "Uncategorized" : selectedCategory,
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

    <CategorySelector
      categories={categories}
      selected={selectedCategory}
      onSelect={setSelectedCategory}
    />

   

    {/* 🔗 Link Grid */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredLinks.map((link) => (
        <LinkCard
          key={link._id}
          _id={link._id}
          title={link.title}
          url={link.url}
          onEdit={() => console.log("Edit", link._id)}
          onDelete={() => console.log("Delete", link._id)}
        />
      ))}
    </div>

  {/* Previous call. <AnalyticsChart links={links} />  */}

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



import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Category {
  _id: string;  // MongoDB uses _id
  name: string;
  user_id: string;
  created_at: string;
}

interface CategorySelectorProps {
  categories: (Category | string)[];
  selected: string;
  onSelect: (category: string) => void;
  onDeleteCategory?: (category: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selected,
  onSelect,
  onDeleteCategory,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    category: Category | null;
  }>({ show: false, x: 0, y: 0, category: null });

  const handleRightClick = (e: React.MouseEvent, categoryObj: Category | null) => {
    if (!categoryObj || !onDeleteCategory) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      category: categoryObj
    });
  };

  const handleDeleteClick = () => {
    if (contextMenu.category && confirm(`Are you sure you want to delete the category "${contextMenu.category.name}"? This will also delete all links in this category.`)) {
      onDeleteCategory?.(contextMenu.category);
    }
    setContextMenu({ show: false, x: 0, y: 0, category: null });
  };

  const hideContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, category: null });
  };

  // Hide context menu when clicking elsewhere
  React.useEffect(() => {
    if (contextMenu.show) {
      document.addEventListener('click', hideContextMenu);
      document.addEventListener('contextmenu', hideContextMenu);
      return () => {
        document.removeEventListener('click', hideContextMenu);
        document.removeEventListener('contextmenu', hideContextMenu);
      };
    }
  }, [contextMenu.show]);

  return (
    <>
      <div className="flex flex-wrap gap-2 px-4 py-2">
        {categories.map((cat) => {
          const categoryName = typeof cat === 'string' ? cat : cat.name;
          const isAllCategory = categoryName === 'All';
          const categoryObj = typeof cat === 'object' ? cat : null;
          
          return (
            <Button
              key={categoryName}
              variant={selected === categoryName ? "default" : "outline"}
              className="capitalize"
              onClick={() => onSelect(categoryName)}
              onContextMenu={(e) => handleRightClick(e, categoryObj)}
              title={!isAllCategory && categoryObj ? "Right-click to delete" : undefined}
            >
              {categoryName}
            </Button>
          );
        })}
      </div>

      {/* Context Menu */}
      {contextMenu.show && contextMenu.category && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 min-w-[140px]"
          style={{ 
            left: contextMenu.x, 
            top: contextMenu.y,
            transform: 'translate(-50%, 0)'
          }}
        >
          <button
            onClick={handleDeleteClick}
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <X size={14} />
            Delete category
          </button>
        </div>
      )}
    </>
  );
};

export default CategorySelector;

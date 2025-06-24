// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Pencil, Trash2 } from "lucide-react";

// interface LinkCardProps {
//   title: string;
//   url: string;
//   _id: string;
//   note?: string; 
//   onEdit: () => void;
//   onDelete: () => void;
// }

// export default function LinkCard({_id, title, url, note, onEdit, onDelete }: LinkCardProps) {
//   return (
    

//  <Card className="bg-muted hover:shadow-md hover:scale-[1.01] transition-all duration-200 w-full border border-gray-200">
//   <CardHeader className="flex flex-row justify-between items-center pb-2">
//     <CardTitle className="text-base text-gray-900 font-medium">{title}</CardTitle>
//     <div className="flex space-x-2">
//       <Button
//         size="icon"
//         variant="outline"
//         className="border-gray-300 hover:border-gray-500"
//         onClick={onEdit}
//       >
//         <Pencil className="h-4 w-4 text-gray-600" />
//       </Button>
//       <Button
//         size="icon"
//         variant="destructive"
//         onClick={onDelete}
//       >
//         <Trash2 className="h-4 w-4" />
//       </Button>
//     </div>
//   </CardHeader>
//   <CardContent>
//     <a
//   href={url}
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-muted-foreground hover:text-primary underline-offset-2 hover:underline transition"
// >
//   {url}
// </a>

//   </CardContent>
// </Card>


//   );
// }





import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2, BookText } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LinkCardProps {
  title: string;
  url: string;
  _id: string;
  note?: string;
  timestamp: number; // Note is optional
  onEdit: () => void;
  onDelete: () => void;
}

export default function LinkCard({ _id, title, url, note, onEdit, onDelete }: LinkCardProps) {
  const [showNote, setShowNote] = useState(false);

  const toggleNoteVisibility = () => {
    setShowNote(prev => !prev);
  };

  return (    <Card className="bg-muted hover:shadow-md hover:scale-[1.01] transition-all duration-200 w-full border border-gray-200 overflow-visible">
      <CardHeader className="flex flex-row justify-between items-center pb-2 relative">
        <CardTitle className="text-base text-gray-900 font-medium">{title}</CardTitle>
        
        {/* Actions Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-background px-2 py-2 text-sm font-medium hover:border-gray-500 hover:bg-accent focus-visible:outline-none focus-visible:ring-1">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="h-4 w-4 mr-2 text-gray-600" />
              Edit
            </DropdownMenuItem>
            {note && (
              <DropdownMenuItem onClick={toggleNoteVisibility} className="cursor-pointer">
                <BookText className="h-4 w-4 mr-2 text-blue-600" />
                {showNote ? "Hide Note" : "View Note"}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-0"> {/* Adjusted padding-top to remove redundant space */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary underline-offset-2 hover:underline transition text-sm break-all" // Added text-sm and break-all for long URLs
        >
          {url}
        </a>        {/* Note Display Area */}
        {showNote && note && (
          <div className="mt-4 relative">
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-l-4 border-gray-400 rounded-r-lg p-4 shadow-sm">
              <div className="flex items-start gap-2">
                <BookText className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Personal Note</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{note}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
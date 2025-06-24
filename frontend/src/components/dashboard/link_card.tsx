import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface LinkCardProps {
  title: string;
  url: string;
  _id: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function LinkCard({_id, title, url, onEdit, onDelete }: LinkCardProps) {
  return (
    // <Card className="w-full bg-gradient-to-br from-purple-100 to-pink-100 shadow-md rounded-xl transition-transform hover:scale-[1.02]">
    //   <CardHeader className="flex flex-row justify-between items-center">
    //     <CardTitle className="text-lg font-semibold text-purple-900">
    //       {title}
    //     </CardTitle>
    //     <div className="flex space-x-2">
    //       <Button size="icon" variant="outline" onClick={onEdit}>
    //         <Pencil className="h-4 w-4 text-purple-700" />
    //       </Button>
    //       <Button size="icon" variant="destructive" onClick={onDelete}>
    //         <Trash2 className="h-4 w-4" />
    //       </Button>
    //     </div>
    //   </CardHeader>
    //   <CardContent>
    //     <a
    //       href={url}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="text-pink-600 hover:underline break-words text-sm"
    //     >
    //       {url}
    //     </a>
    //   </CardContent>
    // </Card>
    

 <Card className="bg-muted hover:shadow-md hover:scale-[1.01] transition-all duration-200 w-full border border-gray-200">
  <CardHeader className="flex flex-row justify-between items-center pb-2">
    <CardTitle className="text-base text-gray-900 font-medium">{title}</CardTitle>
    <div className="flex space-x-2">
      <Button
        size="icon"
        variant="outline"
        className="border-gray-300 hover:border-gray-500"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4 text-gray-600" />
      </Button>
      <Button
        size="icon"
        variant="destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-muted-foreground hover:text-primary underline-offset-2 hover:underline transition"
>
  {url}
</a>

  </CardContent>
</Card>


  );
}

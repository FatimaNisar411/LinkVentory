import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Folder } from "lucide-react";

interface WelcomeCardProps {
  name: string;
  totalLinks: number;
  totalCategories: number;
}

export function WelcomeCard({ name, totalLinks, totalCategories }: WelcomeCardProps) {
  return (
        <Card className="bg-gradient-to-br from-[#1e1e2f] to-[#2b2b40] text-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-1">Welcome back, {name}! 👋</h2>
      <p className="text-sm text-muted-foreground mb-6">
       
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-4 p-4 bg-[#2e2e42] rounded-xl hover:scale-[1.02] transition">
          <BookOpen className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-lg font-semibold">{totalLinks}</p>
            <p className="text-sm text-muted-foreground">Links Saved</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-[#2e2e42] rounded-xl hover:scale-[1.02] transition">
          <Folder className="w-8 h-8 text-yellow-400" />
          <div>
            <p className="text-lg font-semibold">{totalCategories}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
        </div>
      </div>
    </Card>

  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Download, Plus, Settings } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="from-manga-300 to-manga-500 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your manga collection, categories, and user base
        </p>
      </div>

      <div className="flex w-full items-center space-x-2 sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search..."
            className="bg-muted/40 border-manga-600/20 pl-10 backdrop-blur-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4"
          >
            <circle cx={11} cy={11} r={8} />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="bg-manga-500 absolute top-1 right-1 h-2 w-2 rounded-full" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;

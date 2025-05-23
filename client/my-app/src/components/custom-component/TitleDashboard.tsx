import { cn } from "@/lib/utils";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

const TitleDashboard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className={cn("flex flex-row justify-between items-center")}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <SidebarTrigger className={cn("inline-flex md:hidden")} size={"lg"} />
    </div>
  );
};

export default TitleDashboard;

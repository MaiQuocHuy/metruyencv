"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on the home page
  if (pathname === "/") {
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="default"
      size="sm"
      className="hover:bg-accent absolute top-20 left-4 flex items-center gap-1 transition-colors duration-200 md:left-6"
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;

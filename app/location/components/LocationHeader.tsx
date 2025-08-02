"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface LocationHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export function LocationHeader({
  title,
  showBackButton = true,
}: LocationHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-[#BAF6F0] shadow-sm border-b border-gray-200 p-4 sm:p-6 mb-6">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-lg">Back</span>
          </Button>
        )}
        <h1 className="md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}

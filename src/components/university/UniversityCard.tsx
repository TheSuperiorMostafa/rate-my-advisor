"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { GraduationCap } from "lucide-react";

interface UniversityCardProps {
  id: string;
  name: string;
  slug: string;
  location?: string | null;
  departmentCount: number;
}

export function UniversityCard({
  id,
  name,
  slug,
  location,
  departmentCount,
}: UniversityCardProps) {
  const router = useRouter();
  const href = `/u/${id}/${slug}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className="block cursor-pointer"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
    >
      <Card variant="interactive" className="h-full group hover:border-[#5B2D8B]">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#5B2D8B] transition-colors">
            {name}
          </h3>
        </div>
        {location && (
          <p className="text-sm text-gray-600 mb-4">{location}</p>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <GraduationCap className="w-4 h-4" />
          <span>
            {departmentCount} {departmentCount === 1 ? "department" : "departments"}
          </span>
        </div>
      </Card>
    </div>
  );
}


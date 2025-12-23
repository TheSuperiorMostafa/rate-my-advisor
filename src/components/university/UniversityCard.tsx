"use client";

import Link from "next/link";
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
  const href = `/u/${id}/${slug}`;

  return (
    <Link
      href={href}
      className="block no-underline"
      prefetch={true}
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
    </Link>
  );
}


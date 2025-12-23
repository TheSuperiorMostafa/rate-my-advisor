import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagPillsProps {
  tags: Tag[];
  className?: string;
  size?: "sm" | "md";
}

export function TagPills({ tags, className, size = "md" }: TagPillsProps) {
  if (tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Badge key={tag.id} variant="info" size={size}>
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}

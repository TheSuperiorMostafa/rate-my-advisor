interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagPillsProps {
  tags: Tag[];
  className?: string;
}

export function TagPills({ tags, className = "" }: TagPillsProps) {
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}


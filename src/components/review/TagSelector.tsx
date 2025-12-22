"use client";

import { useState } from "react";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  tags: Tag[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
}

export function TagSelector({ tags, selected, onChange, maxSelections = 5 }: TagSelectorProps) {
  const toggleTag = (tagId: string) => {
    if (selected.includes(tagId)) {
      onChange(selected.filter((id) => id !== tagId));
    } else if (selected.length < maxSelections) {
      onChange([...selected, tagId]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags (optional, max {maxSelections})
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selected.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="mt-2 text-xs text-gray-500">
          {selected.length} of {maxSelections} selected
        </p>
      )}
    </div>
  );
}


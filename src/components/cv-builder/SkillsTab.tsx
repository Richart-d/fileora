"use client";

import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  data: string[];
  onChange: (data: string[]) => void;
}

export function SkillsTab({ data, onChange }: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const skill = inputValue.trim();
      // Prevent duplicates (case-insensitive)
      if (!data.some((s) => s.toLowerCase() === skill.toLowerCase())) {
        onChange([...data, skill]);
      }
      setInputValue("");
    }
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary">Add Skills</label>
        <p className="text-xs text-text-muted mb-2">
          Type a skill and press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Enter</kbd> to add it.
        </p>
        <Input
          placeholder="e.g. React, Python, Data Analysis..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-muted">
          <p>No skills added yet. Start typing above to add your skills.</p>
        </div>
      )}

      {data.length > 0 && (
        <p className="text-xs text-text-muted">
          {data.length} skill{data.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
}

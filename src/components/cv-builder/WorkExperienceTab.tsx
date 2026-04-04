"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WorkExperience } from "@/types/resume";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Props {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

const emptyPosition: WorkExperience = {
  company: "",
  title: "",
  startDate: "",
  endDate: "",
  current: false,
  bullets: [""],
};

export function WorkExperienceTab({ data, onChange }: Props) {
  const updateEntry = (index: number, field: keyof WorkExperience, value: unknown) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    // If "current" is toggled on, clear the endDate
    if (field === "current" && value === true) {
      updated[index].endDate = "";
    }
    onChange(updated);
  };

  const addPosition = () => {
    onChange([...data, { ...emptyPosition, bullets: [""] }]);
  };

  const removePosition = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateBullet = (posIndex: number, bulletIndex: number, value: string) => {
    const updated = [...data];
    const bullets = [...updated[posIndex].bullets];
    bullets[bulletIndex] = value;
    updated[posIndex] = { ...updated[posIndex], bullets };
    onChange(updated);
  };

  const addBullet = (posIndex: number) => {
    const updated = [...data];
    updated[posIndex] = {
      ...updated[posIndex],
      bullets: [...updated[posIndex].bullets, ""],
    };
    onChange(updated);
  };

  const removeBullet = (posIndex: number, bulletIndex: number) => {
    const updated = [...data];
    const bullets = updated[posIndex].bullets.filter((_, i) => i !== bulletIndex);
    updated[posIndex] = { ...updated[posIndex], bullets: bullets.length ? bullets : [""] };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {data.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p className="mb-4">No work experience added yet.</p>
        </div>
      )}

      {data.map((entry, index) => (
        <div
          key={index}
          className="bg-white border border-border rounded-lg p-4 space-y-4 relative"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-text-muted">
              <GripVertical className="w-4 h-4" />
              <span className="text-sm font-semibold text-primary">
                Position {index + 1}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
              onClick={() => removePosition(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Company</label>
              <Input
                placeholder="e.g. Access Bank"
                value={entry.company}
                onChange={(e) => updateEntry(index, "company", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Job Title</label>
              <Input
                placeholder="e.g. Software Engineer"
                value={entry.title}
                onChange={(e) => updateEntry(index, "title", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Start Date</label>
              <Input
                placeholder="e.g. Jan 2022"
                value={entry.startDate}
                onChange={(e) => updateEntry(index, "startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">End Date</label>
              <Input
                placeholder={entry.current ? "Present" : "e.g. Dec 2023"}
                value={entry.current ? "" : entry.endDate || ""}
                disabled={entry.current}
                onChange={(e) => updateEntry(index, "endDate", e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-primary">
            <input
              type="checkbox"
              checked={entry.current}
              onChange={(e) => updateEntry(index, "current", e.target.checked)}
              className="rounded border-border accent-accent w-4 h-4"
            />
            I currently work here
          </label>

          <div className="space-y-2">
            <label className="text-xs font-medium text-primary">
              Key Achievements / Responsibilities
            </label>
            {entry.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-center gap-2">
                <span className="text-text-muted text-xs w-4 shrink-0">&bull;</span>
                <Input
                  placeholder="Describe what you achieved..."
                  value={bullet}
                  onChange={(e) => updateBullet(index, bIdx, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-600 h-8 px-1 shrink-0"
                  onClick={() => removeBullet(index, bIdx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-accent hover:text-accent/80 text-xs h-8"
              onClick={() => addBullet(index)}
            >
              + Add bullet point
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 text-primary hover:border-accent hover:text-accent"
        onClick={addPosition}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Position
      </Button>
    </div>
  );
}

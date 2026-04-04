"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Education } from "@/types/resume";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const emptyEducation: Education = {
  school: "",
  degree: "",
  field: "",
  year: "",
  grade: "",
};

export function EducationTab({ data, onChange }: Props) {
  const updateEntry = (index: number, field: keyof Education, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addEducation = () => {
    onChange([...data, { ...emptyEducation }]);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p className="mb-4">No education entries added yet.</p>
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
                Education {index + 1}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
              onClick={() => removeEducation(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-primary">School / Institution</label>
            <Input
              placeholder="e.g. University of Lagos"
              value={entry.school}
              onChange={(e) => updateEntry(index, "school", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Degree</label>
              <Input
                placeholder="e.g. B.Sc"
                value={entry.degree}
                onChange={(e) => updateEntry(index, "degree", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Field of Study</label>
              <Input
                placeholder="e.g. Computer Science"
                value={entry.field}
                onChange={(e) => updateEntry(index, "field", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Year</label>
              <Input
                placeholder="e.g. 2023"
                value={entry.year}
                onChange={(e) => updateEntry(index, "year", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">
                Grade <span className="text-text-muted text-xs">(optional)</span>
              </label>
              <Input
                placeholder="e.g. First Class"
                value={entry.grade || ""}
                onChange={(e) => updateEntry(index, "grade", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 text-primary hover:border-accent hover:text-accent"
        onClick={addEducation}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Certification } from "@/types/resume";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Props {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

const emptyCertification: Certification = {
  name: "",
  issuer: "",
  year: "",
};

export function CertificationsTab({ data, onChange }: Props) {
  const updateEntry = (index: number, field: keyof Certification, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addCertification = () => {
    onChange([...data, { ...emptyCertification }]);
  };

  const removeCertification = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p className="mb-4">No certifications added yet.</p>
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
                Certification {index + 1}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
              onClick={() => removeCertification(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-primary">Certification Name</label>
            <Input
              placeholder="e.g. AWS Solutions Architect"
              value={entry.name}
              onChange={(e) => updateEntry(index, "name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Issuing Organisation</label>
              <Input
                placeholder="e.g. Amazon Web Services"
                value={entry.issuer}
                onChange={(e) => updateEntry(index, "issuer", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Year</label>
              <Input
                placeholder="e.g. 2024"
                value={entry.year}
                onChange={(e) => updateEntry(index, "year", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 text-primary hover:border-accent hover:text-accent"
        onClick={addCertification}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}

"use client";

interface Props {
  data: string;
  onChange: (data: string) => void;
}

export function SummaryTab({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary">Professional Summary</label>
        <p className="text-xs text-text-muted">
          Write a concise 2-4 sentence summary highlighting your experience, key skills, and career goals.
        </p>
        <textarea
          className="w-full min-h-[200px] rounded-lg border border-border bg-white px-4 py-3 text-sm text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
          placeholder="e.g. Results-driven software engineer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud services. Passionate about delivering impactful solutions in fintech and healthcare."
          value={data}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
        />
      </div>

      <p className="text-xs text-text-muted text-right">
        {data.length} character{data.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

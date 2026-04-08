"use client";

import { Input } from "@/components/ui/input";
import { PersonalInfo } from "@/types/resume";
import { User, Mail, Phone, MapPin, Linkedin, Globe, BadgeCheck } from "lucide-react";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  nyscStatus?: string;
  onNyscChange?: (status: string) => void;
}

export function PersonalInfoTab({ data, onChange, nyscStatus, onNyscChange }: Props) {
  const update = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-text-muted">
        <span className="text-red-500">*</span> Required fields
      </p>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary flex items-center gap-2">
          <User className="w-4 h-4 text-text-muted" />
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="e.g. Adebayo Ogunlesi"
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary flex items-center gap-2">
          <Mail className="w-4 h-4 text-text-muted" />
          Email Address <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          placeholder="e.g. adebayo@email.com"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary flex items-center gap-2">
            <Phone className="w-4 h-4 text-text-muted" />
            Phone <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            placeholder="e.g. +234 801 234 5678"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary flex items-center gap-2">
            <MapPin className="w-4 h-4 text-text-muted" />
            Location <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Lagos, Nigeria"
            value={data.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary flex items-center gap-2">
          <Linkedin className="w-4 h-4 text-text-muted" />
          LinkedIn <span className="text-text-muted text-xs">(optional)</span>
        </label>
        <Input
          placeholder="e.g. linkedin.com/in/adebayo"
          value={data.linkedin || ""}
          onChange={(e) => update("linkedin", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary flex items-center gap-2">
          <Globe className="w-4 h-4 text-text-muted" />
          Website / Portfolio <span className="text-text-muted text-xs">(optional)</span>
        </label>
        <Input
          placeholder="e.g. adebayo.dev"
          value={data.website || ""}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {onNyscChange !== undefined && (
        <div className="space-y-1.5 pt-4 border-t border-border mt-4">
          <label className="text-sm font-medium text-primary flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-accent" />
            NYSC Status <span className="text-text-muted text-xs">(Nigerian format, optional)</span>
          </label>
          <Input
            placeholder="e.g. Completed (2020), In Progress, Exempted"
            value={nyscStatus || ""}
            onChange={(e) => onNyscChange(e.target.value)}
            className="border-accent/30 focus-visible:ring-accent"
          />
        </div>
      )}
    </div>
  );
}

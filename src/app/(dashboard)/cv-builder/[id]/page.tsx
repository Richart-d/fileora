"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Edit3, ArrowLeft, FileText, Save, Check } from "lucide-react";
import Link from "next/link";
import { useAutoSave } from "@/hooks/useAutoSave";
import { PersonalInfoTab } from "@/components/cv-builder/PersonalInfoTab";
import { WorkExperienceTab } from "@/components/cv-builder/WorkExperienceTab";
import { EducationTab } from "@/components/cv-builder/EducationTab";
import { SkillsTab } from "@/components/cv-builder/SkillsTab";
import { CertificationsTab } from "@/components/cv-builder/CertificationsTab";
import { SummaryTab } from "@/components/cv-builder/SummaryTab";
import type { PersonalInfo, WorkExperience, Education, Certification } from "@/types/resume";

export default function CVEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Convex data
  const resume = useQuery(api.resumes.getResume, id ? { id: id as Id<"resumes"> } : "skip");
  const updateResume = useMutation(api.resumes.updateResume);

  // Local form state
  const [title, setTitle] = useState("Untitled Resume");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "", email: "", phone: "", location: "",
  });
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [summary, setSummary] = useState("");

  // Hydrate local state from Convex data (once)
  useEffect(() => {
    if (resume && !hasInitialized) {
      setTitle(resume.title || "Untitled Resume");
      setPersonalInfo(resume.personalInfo);
      setWorkExperience(resume.workExperience);
      setEducation(resume.education);
      setSkills(resume.skills);
      setCertifications(resume.certifications);
      setSummary(resume.summary);
      setHasInitialized(true);
    }
  }, [resume, hasInitialized]);

  // Build the data object for auto-save
  const formData = {
    title,
    personalInfo,
    workExperience,
    education,
    skills,
    certifications,
    summary,
  };

  // Auto-save callback
  const handleSave = useCallback(async () => {
    if (!id) return;
    try {
      setSaveStatus("saving");
      await updateResume({
        id: id as Id<"resumes">,
        title,
        personalInfo,
        workExperience,
        education,
        skills,
        certifications,
        summary,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaveStatus("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, title, personalInfo, workExperience, education, skills, certifications, summary, updateResume]);

  // Wire up the 1.5s debounced auto-save
  useAutoSave(formData, handleSave, 1500);

  // Loading state
  if (resume === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-text-muted font-medium">Loading CV Data...</span>
      </div>
    );
  }

  // Not found state
  if (resume === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <h2 className="text-2xl font-sora font-semibold text-primary mb-2">CV Not Found</h2>
        <p className="text-text-muted mb-6">The resume you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.</p>
        <Button onClick={() => router.push("/cv-builder")}>Back to Templates</Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col lg:flex-row h-[calc(100vh-4rem)] border-t border-border -mx-8 lg:mx-0">
      {/* LEFT PANEL - Form (40%) */}
      <div className={`w-full lg:w-[40%] xl:w-[35%] bg-white border-r border-border p-4 lg:p-6 overflow-y-auto h-full ${showPreview ? "hidden lg:block" : "block"}`}>
        {/* Header with back button, title, and save status */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard" className="text-text-muted hover:text-primary transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-sora font-bold text-primary truncate bg-transparent border-none focus:outline-none focus:ring-0 flex-1 min-w-0"
            placeholder="Resume Title"
          />
          <div className="shrink-0">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-xs text-text-muted animate-pulse">
                <Save className="w-3.5 h-3.5" /> Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-xs text-green-600">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto mb-6 bg-surface border border-border p-1">
            <TabsTrigger className="flex-1 min-w-[30%] text-xs py-2" value="personal">Personal Info</TabsTrigger>
            <TabsTrigger className="flex-1 min-w-[30%] text-xs py-2" value="experience">Experience</TabsTrigger>
            <TabsTrigger className="flex-1 min-w-[30%] text-xs py-2" value="education">Education</TabsTrigger>
            <TabsTrigger className="flex-1 min-w-[30%] text-xs py-2" value="skills">Skills</TabsTrigger>
            <TabsTrigger className="flex-1 min-w-[30%] text-xs py-2" value="certifications">Certifications</TabsTrigger>
            <TabsTrigger className="flex-1 min-w-[30%] text-xs py-2" value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <PersonalInfoTab data={personalInfo} onChange={setPersonalInfo} />
          </TabsContent>
          <TabsContent value="experience">
            <WorkExperienceTab data={workExperience} onChange={setWorkExperience} />
          </TabsContent>
          <TabsContent value="education">
            <EducationTab data={education} onChange={setEducation} />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsTab data={skills} onChange={setSkills} />
          </TabsContent>
          <TabsContent value="certifications">
            <CertificationsTab data={certifications} onChange={setCertifications} />
          </TabsContent>
          <TabsContent value="summary">
            <SummaryTab data={summary} onChange={setSummary} />
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT PANEL - Preview (60%) */}
      <div className={`w-full lg:w-[60%] xl:w-[65%] bg-slate-100 flex-col p-4 lg:p-8 overflow-y-auto h-full ${!showPreview ? "hidden lg:flex" : "flex"}`}>
        <div className="w-full flex-1 min-h-[60vh] max-w-3xl mx-auto bg-white shadow-lg border border-gray-200 rounded-sm flex flex-col items-center justify-center aspect-[1/1.414]">
          <FileText className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">PDF Preview Area</p>
          <p className="text-xs text-slate-400 mt-2">Template: {resume.templateId}</p>
        </div>
      </div>

      {/* MOBILE FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <Button
          onClick={() => setShowPreview(!showPreview)}
          size="lg"
          className="rounded-full shadow-2xl flex items-center gap-2 px-6 h-14 bg-primary text-white hover:bg-primary/90"
        >
          {showPreview ? (
            <>
              <Edit3 className="w-5 h-5" />
              <span>Edit Form</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              <span>Preview PDF</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

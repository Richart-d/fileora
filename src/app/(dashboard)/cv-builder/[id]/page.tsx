"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Edit3, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function CVEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  
  const resume = useQuery(api.resumes.getResume, id ? { id: id as Id<"resumes"> } : "skip");

  if (resume === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-text-muted font-medium">Loading CV Data...</span>
      </div>
    );
  }

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
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-sora font-bold text-primary truncate" title={resume.title}>
            {resume.title || "Untitled Resume"}
          </h1>
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
          
          <TabsContent value="personal" className="min-h-[50vh] p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-text-muted">
            <Edit3 className="w-8 h-8 mb-2 opacity-50" />
            <p>Personal Info Form Here</p>
          </TabsContent>
          <TabsContent value="experience" className="min-h-[50vh] p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-text-muted">
            <Edit3 className="w-8 h-8 mb-2 opacity-50" />
            <p>Work Experience Form Here</p>
          </TabsContent>
          <TabsContent value="education" className="min-h-[50vh] p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-text-muted">
            <Edit3 className="w-8 h-8 mb-2 opacity-50" />
            <p>Education Form Here</p>
          </TabsContent>
          <TabsContent value="skills" className="min-h-[50vh] p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-text-muted">
            <Edit3 className="w-8 h-8 mb-2 opacity-50" />
            <p>Skills Form Here</p>
          </TabsContent>
          <TabsContent value="certifications" className="min-h-[50vh] p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-text-muted">
            <Edit3 className="w-8 h-8 mb-2 opacity-50" />
            <p>Certifications Form Here</p>
          </TabsContent>
          <TabsContent value="summary" className="min-h-[50vh] p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-text-muted">
            <Edit3 className="w-8 h-8 mb-2 opacity-50" />
            <p>Summary Form Here</p>
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

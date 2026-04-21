"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, Globe, PenTool } from "lucide-react";
import { toast } from "sonner";

const templates = [
  {
    id: "ats-classic",
    name: "ATS Classic",
    description: "Clean, standard format optimized perfectly for Applicant Tracking Systems.",
    icon: FileText,
    badge: "Most Popular",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    previewClass: "bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-2 p-4",
  },
  {
    id: "modern-pro",
    name: "Modern Professional",
    description: "Sleek and contemporary design with a slight accent for a polished look.",
    icon: Briefcase,
    badge: "Recommended",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    previewClass: "bg-slate-50 border-2 border-slate-200 flex flex-col items-start p-4",
  },
  {
    id: "nigerian-pro",
    name: "Nigerian Pro",
    description: "Includes native field formatting like NYSC status and WAEC/NECO sections.",
    icon: Globe,
    badge: "Local",
    color: "bg-green-50 text-green-700 border-green-200",
    previewClass: "bg-[#F8FAFC] border-2 border-green-100 flex flex-col items-center p-4 border-l-4 border-l-green-600",
  },
  {
    id: "creative",
    name: "Creative Minimal",
    description: "Distinct layouts and modern typography suitable for creative industries.",
    icon: PenTool,
    badge: "Design",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    previewClass: "bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 flex flex-col items-center justify-center",
  }
];

export default function CVBuilderSelectionPage() {
  const router = useRouter();
  const createResume = useMutation(api.resumes.createResume);
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const handleSelectTemplate = async (templateId: string) => {
    try {
      setIsCreating(templateId);
      const resumeId = await createResume({ templateId });
      toast.success("CV created successfully!");
      router.push(`/cv-builder/${resumeId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create CV. Please try again.");
      setIsCreating(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-6xl">
      <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-sora font-bold text-primary mb-4">
          Choose a Template
        </h1>
        <p className="text-text-muted">
          Select a starting point for your resume. All templates are professionally designed and can be fully customized later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          const isProcessing = isCreating === tpl.id;
          
          return (
            <Card key={tpl.id} className="flex flex-col h-full hover:border-accent hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className={`h-40 w-full relative ${tpl.previewClass}`}>
                <Badge variant="secondary" className="absolute top-3 right-3 shadow-sm bg-white/90 backdrop-blur-sm">
                  {tpl.badge}
                </Badge>
                <Icon className={`w-12 h-12 mb-2 ${tpl.color.split(' ')[1]}`} opacity={0.5} />
                <div className="w-2/3 h-2 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/2 h-2 bg-gray-200 rounded mt-2 animate-pulse" />
                <div className="w-3/4 h-2 bg-gray-200 rounded mt-2 animate-pulse" />
              </div>
              
              <CardHeader className="flex-none pb-2 pt-5">
                <CardTitle className="text-lg font-sora text-primary group-hover:text-accent transition-colors">
                  {tpl.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow pb-4">
                <CardDescription className="text-sm text-text-muted leading-relaxed">
                  {tpl.description}
                </CardDescription>
              </CardContent>
              
              <CardFooter className="pt-0 mt-auto">
                <Button 
                  onClick={() => handleSelectTemplate(tpl.id)} 
                  disabled={isCreating !== null}
                  className="w-full font-medium min-h-[44px]"
                  variant={isProcessing ? "secondary" : "default"}
                >
                  {isProcessing ? "Creating..." : "Use This Template"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

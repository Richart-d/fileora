"use client";

import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { ATSClassicTemplate } from "@/lib/cv-templates/ats-classic";
import { ModernProTemplate } from "@/lib/cv-templates/modern-pro";
import type { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface Props {
  data: ResumeData;
}

export default function CVPreview({ data }: Props) {
  // Select the active template
  const TemplateComponent = data.templateId === "modern-pro" ? ModernProTemplate : ATSClassicTemplate;
  const PdfDocument = <TemplateComponent data={data} />;

  const fileName = `${data.personalInfo.name ? data.personalInfo.name.replace(/\s+/g, '-') : "Untitled"}-CV-${new Date().toISOString().split("T")[0]}.pdf`;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-sora font-semibold text-primary">Live Preview</h2>
        <PDFDownloadLink document={PdfDocument} fileName={fileName}>
          {({ loading }) => (
            <Button
              className="bg-accent text-white hover:bg-accent/90 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="flex-1 w-full bg-white shadow-lg overflow-hidden border border-border rounded-lg">
        <PDFViewer style={{ width: "100%", height: "100%", border: "none" }} showToolbar={true}>
          {PdfDocument}
        </PDFViewer>
      </div>
    </div>
  );
}

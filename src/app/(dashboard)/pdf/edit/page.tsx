import Link from "next/link";
import {
  FileText,
  FileArchive,
  Layers,
  Scissors,
  FileMinus,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";

export const metadata = {
  title: "PDF Editor Toolkit - Fileora",
  description: "Merge, split, compress, convert, and edit your PDF files quickly and easily.",
};

const pdfTools = [
  {
    title: "Convert PDF",
    description: "Convert PDFs to Docs, Images, HTML, or turn other files into PDFs.",
    href: "/pdf/convert",
    icon: RefreshCcw,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF file size securely while maintaining maximum visible quality.",
    href: "/pdf/compress",
    icon: FileArchive,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs in the exact order you want into a single document.",
    href: "/pdf/merge",
    icon: Layers,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    title: "Split PDF",
    description: "Extract specific pages or separate one PDF into multiple files effortlessly.",
    href: "/pdf/split",
    icon: Scissors,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    title: "Remove Pages",
    description: "Delete unwanted pages from your document using a visual thumbnail selector.",
    href: "/pdf/remove-pages",
    icon: FileMinus,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
];

export default function PDFToolsHubPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-6xl">
      <div className="mb-8 sm:mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-sora font-extrabold text-primary mb-4 tracking-tight">
          PDF Tools Hub
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          Everything you need to modify, format, compress, and organize your PDF documents—all in one secure place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfTools.map((tool) => (
          <Link href={tool.href} key={tool.title} className="group outline-none">
            <div className={`h-full bg-white rounded-2xl border-2 border-border hover:${tool.borderColor} p-5 sm:p-8 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden relative`}>
              
              {/* Background gradient hint */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full translate-x-10 -translate-y-10 ${tool.bgColor}`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transition-transform group-hover:scale-110 duration-300 ${tool.bgColor}`}>
                  <tool.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${tool.color}`} />
                </div>
                
                <h3 className="text-xl font-sora font-semibold text-primary mb-3">
                  {tool.title}
                </h3>
                
                <p className="text-sm text-text-muted leading-relaxed mb-8 flex-grow">
                  {tool.description}
                </p>
              </div>
              
              <div className="mt-auto relative z-10 text-left">
                <span className="inline-flex items-center text-sm font-semibold text-accent group-hover:text-primary transition-colors min-h-[44px]">
                  Open Tool
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Placeholder / Coming Soon card for grid symmetry */}
        <div className="h-full bg-slate-50 rounded-2xl border-2 border-dashed border-border p-5 sm:p-8 flex flex-col items-center justify-center text-center opacity-70">
          <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center mb-6">
            <FileText className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-xl font-sora font-semibold text-slate-500 mb-2">
            More Tools
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-2">
            We are constantly expanding our toolkit. Suggest a tool!
          </p>
        </div>
      </div>
    </div>
  );
}

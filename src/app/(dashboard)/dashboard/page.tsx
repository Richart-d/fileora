"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileDown, Edit3, Plus, File, Clock } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const resumes = useQuery(api.resumes.get);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-sora font-bold text-primary mb-2">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
        </h1>
        <p className="text-text-muted">Here's what's happening with your documents today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/cv-builder" className="group">
          <Card className="h-full border-border hover:border-primary hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                <Plus className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-sora text-primary">Start New CV</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-muted">
                Create a professional ATS-friendly resume from scratch.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/pdf/convert" className="group">
          <Card className="h-full border-border hover:border-accent hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                <FileDown className="w-5 h-5 text-accent group-hover:text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-sora text-primary">Convert PDF</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-muted">
                Transform Word, Excel, and images to or from PDF.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/pdf/edit" className="group">
          <Card className="h-full border-border hover:border-primary hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                <Edit3 className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-sora text-primary">Edit PDF</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-muted">
                Merge, split, compress, or remove pages from PDFs.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-sora font-semibold text-primary">My CVs</h2>
            <Link href="/cv-builder" className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {resumes === undefined ? (
              <Card className="p-8 flex items-center justify-center text-text-muted border-dashed border-2">
                Loading resumes...
              </Card>
            ) : resumes.length === 0 ? (
              <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-border bg-surface/50">
                <FileText className="w-12 h-12 text-text-muted/50 mb-4" />
                <h3 className="text-lg font-sora font-medium text-primary mb-1">No CVs yet</h3>
                <p className="text-text-muted text-sm max-w-sm mb-6">
                  You haven't created any CVs. Start building your professional resume today.
                </p>
                <Link href="/cv-builder" className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                  Create First CV
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resumes.map((resume) => (
                  <Card key={resume._id} className="hover:border-accent transition-colors flex flex-col h-full">
                    <CardHeader className="pb-3 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <File className="w-8 h-8 text-primary opacity-80" />
                        <span className="text-xs font-medium text-text-muted px-2 py-1 bg-secondary rounded-full">
                          {resume.templateId.replace("-", " ")}
                        </span>
                      </div>
                      <CardTitle className="text-base font-sora font-semibold text-primary line-clamp-1 flex-1 min-h-[1.5rem] mt-2">
                        {resume.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-text-muted mt-2">
                        Last edited: {new Date(resume.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <div className="px-6 pb-6 pt-0 mt-auto flex gap-2">
                      <Link href={`/cv-builder/${resume._id}`} className="flex-1 bg-secondary hover:bg-secondary/80 text-primary text-center py-2 rounded-md text-sm font-medium transition-colors">
                        Edit
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-sora font-semibold text-primary mb-6">Recent Activity</h2>
          <Card className="border-border">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Clock className="w-12 h-12 text-text-muted/50 mb-4" />
              <h3 className="text-base font-sora font-medium text-primary mb-1">No recent activity</h3>
              <p className="text-text-muted text-sm">
                Your recent PDF conversions and edits will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

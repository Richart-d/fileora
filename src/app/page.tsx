'use client'

import Link from 'next/link'
import { useAuth, SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, FileDown, Edit3, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 h-16 flex items-center justify-between border-b border-border/40">
        <div className="text-2xl font-sora font-bold text-primary">Fileora</div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <Button asChild className="bg-primary text-white hover:bg-primary/90">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="text-sm font-medium text-text-primary hover:text-primary transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
        <h1 className="text-4xl md:text-6xl font-sora font-bold text-primary max-w-4xl tracking-tight mb-6">
          Build your CV. Manage your PDFs. All in one place.
        </h1>
        <p className="text-lg md:text-xl text-text-muted max-w-2xl mb-10">
          The ultimate document utility platform for professionals. Create ATS-friendly resumes and handle all your PDF conversions and edits for free.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button asChild size="lg" className="bg-accent text-white hover:bg-accent/90 w-full sm:w-auto h-12 px-8 text-base">
            <Link href="/sign-up">Get Started Free <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 w-full sm:w-auto h-12 px-8 text-base">
            <a href="#features">See Features</a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-primary mb-4">Everything you need</h2>
            <p className="text-text-muted max-w-xl mx-auto">Powerful tools designed to make your professional life easier.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <Card className="hover:border-accent hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-sora text-primary">CV Builder</CardTitle>
                <CardDescription className="text-text-muted">
                  Create professional, ATS-compliant resumes with smart templates and AI-assisted content improvement.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Card 2 */}
            <Card className="hover:border-accent hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <FileDown className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-sora text-primary">PDF Converter</CardTitle>
                <CardDescription className="text-text-muted">
                  Convert documents effortlessly. Transform Word, Excel, Images, and HTML to and from PDF format.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Card 3 */}
            <Card className="hover:border-accent hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Edit3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-sora text-primary">PDF Editor</CardTitle>
                <CardDescription className="text-text-muted">
                  Your complete toolkit. Merge multiple files, split pages, compress sizes, and remove specific pages instantly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-12 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-sora font-bold mb-4">Fileora</div>
              <p className="text-primary-foreground/80 max-w-xs leading-relaxed">
                The go-to document platform for professionals. Simple, fast, and free.
              </p>
            </div>
            <div>
              <h4 className="font-sora font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/sign-up" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-sora font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} Fileora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

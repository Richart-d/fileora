"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderAuth } from "@/components/HeaderAuth";
import { useAuth } from "@clerk/nextjs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetHeader
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, FileDown, Combine, SplitSquareVertical, Minimize2, FileMinus } from "lucide-react";
import { cn } from "@/lib/utils";

const pdfTools = [
  { name: "Convert PDF", href: "/pdf/convert", icon: FileDown },
  { name: "Merge PDFs", href: "/pdf/merge", icon: Combine },
  { name: "Split PDF", href: "/pdf/split", icon: SplitSquareVertical },
  { name: "Compress PDF", href: "/pdf/compress", icon: Minimize2 },
  { name: "Remove Pages", href: "/pdf/remove-pages", icon: FileMinus },
];

export function Navbar() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const NavLinks = () => (
    <>
      <Link 
        href="/dashboard" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
        )}
        onClick={() => setIsOpen(false)}
      >
        Dashboard
      </Link>
      <Link 
        href="/cv-builder" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/cv-builder") ? "text-primary" : "text-muted-foreground"
        )}
        onClick={() => setIsOpen(false)}
      >
        CV Builder
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-2xl font-sora font-bold text-primary">
            Fileora
          </Link>
        </div>

        {/* Centre: Desktop Navigation (Only when signed in) */}
        <div className="hidden md:flex items-center gap-6">
          {isSignedIn && (
            <>
              <NavLinks />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary outline-none">
                  PDF Tools <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {pdfTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <DropdownMenuItem key={tool.name} asChild>
                        <Link href={tool.href} className="flex items-center gap-2 cursor-pointer w-full">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span>{tool.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Right: Auth & Mobile Menu */}
        <div className="flex items-center gap-4">
          <HeaderAuth />
          
          {isSignedIn && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-primary">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-80">
                <SheetHeader>
                  <SheetTitle className="text-left font-sora text-primary">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex flex-col gap-4">
                    <NavLinks />
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <h4 className="text-sm font-semibold text-primary font-sora">PDF Tools</h4>
                    <div className="flex flex-col gap-3 pl-4 border-l-2 border-border mt-2">
                      {pdfTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className={cn(
                              "flex items-center gap-3 text-sm transition-colors hover:text-primary",
                               pathname === tool.href ? "text-primary font-medium" : "text-muted-foreground"
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {tool.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

      </div>
    </header>
  );
}

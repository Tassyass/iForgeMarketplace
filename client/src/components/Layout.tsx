import { Link } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Menu, X } from "lucide-react";
import { memo, useState } from "react";

// Skip link component
const SkipLink = memo(() => (
  <div
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded focus:z-50"
    role="navigation"
    aria-label="Skip to main content"
    tabIndex={0}
    onClick={() => {
      document.getElementById("main-content")?.focus();
    }}
  >
    Skip to main content
  </div>
));

SkipLink.displayName = "SkipLink";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <header 
        className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
        role="banner"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="h-8 relative shrink-0 cursor-pointer" aria-label="iForge Home">
                <img 
                  src="/Logo iForge-8.png" 
                  alt="iForge" 
                  className="h-8 w-auto object-contain" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    const textLogo = document.createElement('span');
                    textLogo.textContent = 'iForge';
                    textLogo.className = 'text-2xl font-bold text-primary';
                    e.currentTarget.parentNode?.appendChild(textLogo);
                  }}
                />
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <div className={`${isSearchOpen ? 'flex' : 'hidden'} md:flex flex-1 max-w-2xl items-center gap-2`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input 
                placeholder="Search models..." 
                className="pl-9 w-full"
                aria-label="Search models"
                role="searchbox"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] hidden md:flex" aria-label="Select category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>

          <nav 
            className={`${
              isMobileMenuOpen ? 'absolute left-0 right-0 top-16 border-b bg-background p-4' : 'hidden'
            } md:flex md:static md:p-0 md:border-0 items-center gap-6`}
            role="navigation" 
            aria-label="Main navigation"
          >
            <Link href="/models">
              <div className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer">
                Browse Models
              </div>
            </Link>
            <Link href="/create">
              <div className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer">
                Create
              </div>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full hover:scale-105 transition-transform duration-200"
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-pointer" role="menuitem">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" role="menuitem">
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={() => logout()}
                    role="menuitem"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button 
                  className="transition-transform hover:scale-105 duration-200 w-full md:w-auto"
                  aria-label="Login"
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" className="min-h-[calc(100vh-8rem)]" role="main" tabIndex={-1}>
        {children}
      </main>

      <footer className="border-t mt-auto" role="contentinfo">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} iForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

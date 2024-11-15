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
import { Search, Menu, X, Plus, Settings, Twitter, Facebook, Instagram, Github, Mail, ArrowRight } from "lucide-react";
import { memo, useState, Suspense, useCallback } from "react";

// Skip link component
const SkipLink = memo(() => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded focus:z-[100]"
  >
    Skip to main content
  </a>
));

SkipLink.displayName = "SkipLink";

// Loading fallback for user data
const UserLoadingFallback = memo(() => (
  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
));

UserLoadingFallback.displayName = "UserLoadingFallback";

// Memoized header content
const HeaderContent = memo(({ isSearchOpen }: { isSearchOpen: boolean }) => (
  <div className="flex items-center gap-4">
    <Link href="/">
      <div 
        className="h-10 relative shrink-0 cursor-pointer" 
        aria-label="iForge - Return to homepage"
      >
        <img 
          src="/Logo iForge-8.png" 
          alt="iForge - 3D Model Marketplace" 
          className="h-full w-auto object-contain px-2"
          loading="eager"
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
  </div>
));

HeaderContent.displayName = "HeaderContent";

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [email, setEmail] = useState("");

  // Handle search submission
  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const searchInput = form.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput?.value) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.value)}`;
    }
  }, []);

  const handleNewsletterSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Newsletter submission logic would go here
    setEmail("");
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SkipLink />
      <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex h-full items-center justify-between gap-4">
            <HeaderContent isSearchOpen={isSearchOpen} />

            <form 
              onSubmit={handleSearch}
              className={`${isSearchOpen ? 'flex' : 'hidden'} md:flex flex-1 max-w-2xl items-center gap-2`}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Search models..." 
                  className="pl-9 w-full"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] hidden md:flex">
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
            </form>

            <nav className="flex items-center gap-4">
              <Link href="/create">
                <Button variant="ghost">Create</Button>
              </Link>

              {user && (
                <Button variant="outline" size="icon" asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Create Model</span>
                  </Link>
                </Button>
              )}
              
              <Suspense fallback={<UserLoadingFallback />}>
                {isLoading ? (
                  <UserLoadingFallback />
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar>
                          <AvatarFallback>
                            {user.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[100]">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      {user.isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => logout()}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </Suspense>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About iForge</h3>
              <p className="text-sm text-muted-foreground">
                The world's first marketplace for direct 3D printing from talented creators.
              </p>
              <div className="flex space-x-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">Github</span>
                </a>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Categories</h3>
              <ul className="space-y-2">
                <li><Link href="/categories?category=gaming" className="text-sm text-muted-foreground hover:text-primary">Gaming</Link></li>
                <li><Link href="/categories?category=mechanical" className="text-sm text-muted-foreground hover:text-primary">Mechanical</Link></li>
                <li><Link href="/categories?category=art" className="text-sm text-muted-foreground hover:text-primary">Art</Link></li>
                <li><Link href="/categories?category=utility" className="text-sm text-muted-foreground hover:text-primary">Utility</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter for the latest updates and exclusive offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">Subscribe to newsletter</span>
                  </Button>
                </div>
              </form>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} iForge. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="mailto:support@iforge.com" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@iforge.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

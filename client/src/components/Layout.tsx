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
import { memo, useState, Suspense, useCallback } from "react";

// Skip link component
const SkipLink = memo(() => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded focus:z-50"
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
  </div>
));

HeaderContent.displayName = "HeaderContent";

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle search submission
  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const searchInput = form.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput?.value) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.value)}`;
    }
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto h-16 px-4">
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
              <Link href="/categories">
                <Button variant="ghost">Browse</Button>
              </Link>
              
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
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

      <footer className="border-t">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} iForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

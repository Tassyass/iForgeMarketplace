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
import { Search } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="h-8 relative shrink-0">
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

          <div className="flex-1 max-w-2xl flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search models..." 
                className="pl-9 w-full"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
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

          <nav className="flex items-center gap-6">
            <Link href="/models">
              <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Browse Models
              </span>
            </Link>
            <Link href="/create">
              <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Create
              </span>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full hover:scale-105 transition-transform duration-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={() => logout()}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="transition-transform hover:scale-105 duration-200">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="min-h-[calc(100vh-8rem)]">{children}</main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} iForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

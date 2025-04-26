'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">Where Should I Go</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/profile"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  pathname === "/profile"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                )}
              >
                Profile
              </Link>
              <Link
                href="/newsfeed"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                  pathname === "/newsfeed"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                )}
              >
                Newsfeed
              </Link>
               <Link
                 href="/school"
                 className={cn(
                   "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                   pathname === "/schools"
                     ? "border-primary text-primary"
                     : "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                 )}
               >
                 Rankings
               </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


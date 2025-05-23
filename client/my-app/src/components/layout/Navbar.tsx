'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  User,
  Home,
  Bookmark,
  ChevronDown,
  Grid,
  LogIn,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MegaMenu from './MegaMenu'; // Assuming MegaMenu component exists
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'; // Corrected path assuming it's in ui
import { ScrollArea } from '@/components/ui/scroll-area'; // Corrected path assuming it's in ui
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { getUserCurrent, logout } from '@/lib/redux/slices/authSlice';
import { useGetCategoriesQuery } from '@/services/apiCategory';
import { toggleNavbar } from '@/lib/redux/slices/uiSlice';
import { Search } from 'lucide-react';

// Define Props interface

// Correctly define component with props and default value
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const isNavbar = useAppSelector((state) => state.ui.isNavbar);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const mobileCategoriesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // RTK Query hooks
  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery(); // Add loading/error handling if needed in UI
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // When opening the menu, prevent scrolling on the body
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const toggleMegaMenu = () => {
    setMegaMenuOpen(!megaMenuOpen);
  };

  const closeMegaMenu = () => {
    setMegaMenuOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setMegaMenuOpen(false); // Close mega menu when mobile menu closes
    document.body.style.overflow = ''; // Ensure overflow is reset
  };

  // Close mega menu when clicking outside (Desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    dispatch(getUserCurrent());
  }, [dispatch]);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home className="mr-1 h-4 w-4" /> },
    {
      name: 'Search',
      href: '/manga/list',
      icon: <Search className="mr-1 h-4 w-4" />
    }
  ];

  if (isNavbar) {
    return null;
  }

  return (
    <>
      {/* Main Navbar container */}
      <nav className="border-border bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="from-manga-300 to-manga-500 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                  MangaSphere
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'group relative px-3 py-2 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-manga-400'
                      : 'text-foreground hover:text-manga-300'
                  )}
                >
                  <span className="flex items-center">
                    {link.icon}
                    {link.name}
                  </span>
                  <span
                    className={cn(
                      'bg-manga-500 absolute bottom-0 left-0 h-0.5 w-full scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100',
                      pathname === link.href && 'scale-x-100'
                    )}
                  />
                </Link>
              ))}

              {/* Categories with mega menu (Desktop) */}
              <div className="relative" ref={categoriesRef}>
                <button
                  className={cn(
                    'group relative flex items-center px-3 py-2 text-sm font-medium transition-colors', // Added flex items-center
                    megaMenuOpen
                      ? 'text-manga-400'
                      : 'text-foreground hover:text-manga-300'
                  )}
                  onClick={toggleMegaMenu}
                >
                  <Grid className="mr-1 h-4 w-4" />
                  Categories
                  <ChevronDown
                    className={cn(
                      'ml-1 h-4 w-4 transition-transform duration-300',
                      megaMenuOpen && 'rotate-180'
                    )}
                  />
                  <span // Underline span
                    className={cn(
                      'bg-manga-500 absolute bottom-0 left-0 h-0.5 w-full scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100',
                      megaMenuOpen && 'scale-x-100'
                    )}
                  />
                </button>
                {/* Assuming MegaMenu handles its own visibility based on isOpen prop */}
                <MegaMenu isOpen={megaMenuOpen} onClose={closeMegaMenu} />
              </div>
            </div>

            {/* Desktop User Actions/Auth */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {' '}
              {/* Reduced space slightly */}
              {auth.tokens ? (
                // User Dropdown when logged in
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {auth.user?.name || 'My Account'}{' '}
                      {/* Display username if available */}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Number(auth.clientId) == 1 && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={'/dashboard/manga'}
                          className={cn(
                            'flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200', // Adjusted padding/text size
                            pathname === '/dashboard/manga'
                              ? 'bg-accent text-manga-400'
                              : 'hover:bg-accent/50'
                          )}
                          onClick={closeMenu}
                        >
                          Dashboard For Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/change-password"
                        className="w-full cursor-pointer"
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        <span>Change Password</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()} // Prevent closing dropdown before dispatch finishes
                      asChild
                    >
                      <Button
                        variant="ghost" // Use ghost or outline for less emphasis inside dropdown
                        size="sm"
                        className="w-full justify-start px-2 py-1.5 text-red-600 hover:text-red-700" // Added styling
                        onClick={() => dispatch(logout())}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Login/Signup buttons when logged out
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-manga-600 hover:bg-manga-700"
                    asChild
                  >
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="flex items-center md:hidden">
              {' '}
              {/* Added items-center */}
              {/* Consider adding mobile search icon here? */}
              <Button
                variant="ghost"
                size="icon" // Use size="icon" for consistent padding
                onClick={toggleMenu}
                className="ml-2 rounded-full" // Added margin and rounded
              >
                <span className="sr-only">Toggle menu</span>{' '}
                {/* Accessibility */}
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay - Conditionally rendered */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMenu} // Close menu when clicking overlay
          aria-hidden="true" // Hide from accessibility tree when overlay is present
        />
      )}

      {/* Mobile Navigation Menu Panel */}
      <div
        className={cn(
          'bg-background fixed inset-y-0 top-0 right-0 z-40 w-full max-w-xs transform overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out md:hidden', // Use inset-y-0, right-0, top-0; defined max-width
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        // Add aria-labelledby or role="dialog" if needed for accessibility
      >
        {/* Mobile Menu Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <span className="font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={closeMenu}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        {/* Mobile Menu Content */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          {' '}
          {/* Adjust height considering header */}
          <div className="flex flex-col space-y-1 p-4">
            {' '}
            {/* Reduced space */}
            {navLinks.map((link) => (
              <Link
                key={'mobile-' + link.name} // Use unique key prefix for mobile
                href={link.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200', // Adjusted padding/text size
                  pathname === link.href
                    ? 'bg-accent text-manga-400'
                    : 'hover:bg-accent/50'
                )}
                onClick={closeMenu} // Close menu on link click
              >
                {/* Removed icon transition for simplicity */}
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            {/* Mobile Categories Accordion-like section */}
            <div ref={mobileCategoriesRef} className="py-1">
              {/* Added padding */}
              <button
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200', // Adjusted padding/text size
                  megaMenuOpen ? 'bg-accent' : 'hover:bg-accent/50'
                )}
                onClick={() => setMegaMenuOpen(!megaMenuOpen)} // Toggle directly
                aria-expanded={megaMenuOpen} // Accessibility
              >
                <div className="flex items-center">
                  <Grid className="mr-3 h-5 w-5" />
                  Categories
                </div>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 transition-transform duration-300',
                    megaMenuOpen && 'rotate-180'
                  )}
                />
              </button>
              {/* Mobile Categories Dropdown Content */}
              {megaMenuOpen && (
                <div className="animate-in slide-in-from-top-3 mt-1 pl-4 duration-200">
                  {' '}
                  {/* Faster animation, added padding */}
                  {/* You might want a simpler list for mobile instead of the full MegaMenu structure */}
                  {/* This example uses the fetched categories directly */}
                  <div className="border-muted/50 space-y-1 border-l py-2 pl-3">
                    {' '}
                    {/* Indented style */}
                    {isLoading && (
                      <p className="text-muted-foreground p-2 text-sm">
                        Loading...
                      </p>
                    )}
                    {isError && (
                      <p className="p-2 text-sm text-red-600">
                        Error loading categories.
                      </p>
                    )}
                    {!isLoading &&
                      !isError &&
                      categories.map((category) => (
                        <Link
                          key={'mobile-cat-' + category.category_id}
                          href={`/discover?category=${category.category_id}`}
                          className="hover:bg-accent/70 active:bg-accent flex items-center gap-2 rounded-md p-2 text-sm transition-all duration-200"
                          onClick={closeMenu} // Close main menu on category click
                        >
                          {/* Add icons if desired */}
                          <span className="truncate font-medium">
                            {category.category_name}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
            {/* Mobile Profile/Auth Links */}
            {auth.tokens?.access_token ? (
              <>
                {Number(auth.clientId) == 1 && (
                  <Link
                    href={'/dashboard/manga'}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200', // Adjusted padding/text size
                      pathname === '/dashboard'
                        ? 'bg-accent text-manga-400'
                        : 'hover:bg-accent/50'
                    )}
                    onClick={closeMenu}
                  >
                    Dashboard For Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200', // Adjusted padding/text size
                    pathname === '/profile'
                      ? 'bg-accent text-manga-400'
                      : 'hover:bg-accent/50'
                  )}
                  onClick={closeMenu}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </Link>
                <Link
                  href="/change-password"
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200' // Adjusted padding/text size
                  )}
                >
                  Change Password
                </Link>
                <button
                  className="text-destructive hover:bg-destructive/10 flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200"
                  onClick={() => {
                    dispatch(logout());
                    closeMenu(); // Close menu after logout
                  }}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              // Auth buttons if logged out
              <div className="space-y-3 border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start transition-all duration-300"
                  asChild
                >
                  <Link href="/login" onClick={closeMenu}>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Link>
                </Button>
                <Button
                  className="bg-manga-600 hover:bg-manga-700 w-full justify-start transition-all duration-300"
                  asChild
                >
                  <Link href="/register" onClick={closeMenu}>
                    {/* Consider adding an icon like UserPlus */}
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default Navbar;

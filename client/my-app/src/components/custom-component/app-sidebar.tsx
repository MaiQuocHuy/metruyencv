import {
  BarChart3,
  FolderTree,
  BookOpen,
  Calendar,
  Home,
  HomeIcon,
  PanelLeft,
  Search,
  Settings,
  Users,
  Flag
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Manga',
    href: '/dashboard/manga',
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    title: 'Categories',
    href: '/dashboard/categories',
    icon: <FolderTree className="h-5 w-5" />
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Errors',
    href: '/dashboard/errors',
    icon: <Flag className="h-5 w-5" />
  }
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const isNavItemActive = (href: string) => {
    // Check for exact match
    if (pathname === href) return true;

    // Check for nested routes (if pathname starts with href and href is not just the root)
    if (href !== '/' && pathname.startsWith(href)) return true;

    return false;
  };
  return (
    <Sidebar
      collapsible="icon"
      style={{ height: '100vh' }}
      className="bg-[#1f192a] shadow-sm"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size={'lg'}
              className={cn('p-2')}
              onClick={() => toggleSidebar()}
            >
              <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <div className="flex items-center">
                  <Image
                    src={'/MANGA.webp'}
                    alt="Vercel Logo"
                    sizes="25px"
                    width={25}
                    height={20}
                    className={cn(
                      'transition duration-200 group-data-[collapsible=icon]:group-hover:brightness-75'
                    )}
                  />
                  {/* <Link
                    href="/dashboard/manga"
                    className="flex items-center space-x-2"
                  >
                    <span className="from-manga-300 to-manga-500 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                      MangaSphere
                    </span>
                  </Link> */}
                </div>
                <PanelLeft
                  size={24}
                  className={cn(
                    'text-manga-500 h-5 w-5 group-data-[collapsible=icon]:hidden'
                  )}
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className={cn('gap-0')}>
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.href);
            return (
              <SidebarMenuItem
                key={item.title}
                className={cn(
                  'transition-all group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4',
                  {
                    'border-manga-500 bg-card/50 border-l-4': isActive,
                    'border-l-4 border-transparent': !isActive
                  }
                )}
              >
                <SidebarMenuButton
                  size={'lg'}
                  asChild
                  className={cn(
                    'group rounded-none p-7 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center',
                    {
                      'text-manga-600 font-medium': isActive,
                      'hover:text-manga-500': !isActive
                    }
                  )}
                >
                  <Link
                    href={item.href}
                    scroll={false}
                    className={cn('relative flex items-center space-x-2', {
                      'text-manga-600': isActive,
                      'hover:text-manga-500 text-gray-700': !isActive
                    })}
                  >
                    {item.icon}
                    <span
                      className={cn(
                        'text-lg group-data-[collapsible=icon]:hidden'
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

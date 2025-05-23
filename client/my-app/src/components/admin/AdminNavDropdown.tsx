import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Home, LogOut, Menu, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { logout } from '@/lib/redux/slices/authSlice';
import { cn } from '@/lib/utils';
import { useGetUserProfileQuery } from '@/services/apiManga';
import { skip } from 'node:test';

const AdminNavDropdown = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const clientId = Number(auth.clientId || 0);

  // Fetch user profile data only if clientId is valid
  const { data: user, isLoading: isLoadingUser } = useGetUserProfileQuery(
    clientId,
    {
      skip: clientId === 0 // Skip the query if clientId is 0
    }
  );
  return (
    <div className="flex items-center justify-between md:justify-end">
      <SidebarTrigger className="md:hidden">
        <div className="hidden">
          <Menu className="h-10 w-10" />
        </div>
      </SidebarTrigger>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* <Button variant="ghost" size="lg" className="rounded-full"> */}
          <div className="mb-3">
            <div className="hover:bg-manga/50 border-manga-200 ml-auto inline-flex cursor-pointer rounded-full border-2 p-1">
              <User className="h-7 w-7" />
            </div>
          </div>
          {/* </Button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user && user?.usr_name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href="/"
              className="hover:bg-accent hover:text-accent-foreground w-full cursor-pointer"
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="hover:bg-accent hover:text-accent-foreground w-full cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn('w-full cursor-pointer justify-start border-0')}
              onClick={() => dispatch(logout())}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminNavDropdown;

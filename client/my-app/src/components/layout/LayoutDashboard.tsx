'use client';

import React, { useEffect } from 'react';
import {
  BarChart3,
  Bookmark,
  BookOpen,
  FolderTree,
  LogOut,
  Menu,
  Settings,
  User,
  Users
} from 'lucide-react';
import { AppSidebar } from '../custom-component/app-sidebar';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { getUserCurrent, logout } from '@/lib/redux/slices/authSlice';
import DashboardSkeleton from '../skeleton/DashboardSkeleton';
import AdminNavDropdown from '../admin/AdminNavDropdown';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUserCurrent());
  }, []);

  console.log('auth', auth);

  if (!auth.isAuthenticated) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex flex-1 overflow-hidden p-4">
        <div className="w-full">
          {/* User Dropdown */}
          <AdminNavDropdown />
          <div className="min-h-screen flex-grow overflow-y-auto transition-all duration-500 ease-in-out">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

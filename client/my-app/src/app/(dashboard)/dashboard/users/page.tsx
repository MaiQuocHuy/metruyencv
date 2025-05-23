'use client';

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TitleDashboard from '@/components/custom-component/TitleDashboard';
import { useGetListUserQuery } from '@/services/apiUser';
import {
  ADMIN_ROLE_ID,
  FILTER_ALL,
  ROLES,
  STATUSES,
  USER_ROLE_ID
} from '@/lib/constants/user';
import { RoleId, RoleName, Status } from '@/types/user';
import { UserFilters, UserStats, UserTable } from '@/components/user';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<typeof FILTER_ALL | RoleName>(
    FILTER_ALL
  );
  const [statusFilter, setStatusFilter] = useState<typeof FILTER_ALL | Status>(
    FILTER_ALL
  );

  const { data: userData, isLoading, isError, error } = useGetListUserQuery();

  const processedUsers = useMemo(() => {
    if (!userData?.listUser) return [];

    const lowerSearchQuery = searchQuery.toLowerCase();

    return userData.listUser
      .filter((user) => {
        const searchMatch =
          user.usr_name.toLowerCase().includes(lowerSearchQuery) ||
          user.usr_email.toLowerCase().includes(lowerSearchQuery);
        const roleMatch =
          roleFilter === FILTER_ALL ||
          ROLES[user.usr_role as RoleId]?.name === roleFilter;
        const statusMatch =
          statusFilter === FILTER_ALL || user.usr_status === statusFilter;
        return searchMatch && roleMatch && statusMatch;
      })
      .sort((a, b) => a.usr_name.localeCompare(b.usr_name));
  }, [userData?.listUser, searchQuery, roleFilter, statusFilter]);

  const userStats = useMemo(() => {
    const list = userData?.listUser ?? [];
    const total = userData?.total ?? 0;
    const active = list.filter((u) => u.usr_status === STATUSES.ACTIVE).length;
    const suspended = list.filter(
      (u) => u.usr_status === STATUSES.SUSPENDED
    ).length;
    const inactive = total > 0 ? total - active - suspended : 0;
    const admin = list.filter((u) => u.usr_role === ADMIN_ROLE_ID).length;
    const user = list.filter((u) => u.usr_role === USER_ROLE_ID).length;

    return {
      totalUsers: total,
      activeUsers: active,
      inactiveUsers: inactive,
      suspendedUsers: suspended,
      adminCount: admin,
      userCount: user
    };
  }, [userData]);

  if (isError) {
    return (
      <div className="border-destructive/50 bg-destructive/10 text-destructive flex h-64 flex-col items-center justify-center gap-4 rounded-md border border-dashed p-6">
        <p className="font-semibold">Error Loading Users</p>
        <p className="text-sm">
          Could not fetch user data. Please try again later.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</pre>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <TitleDashboard
          title="Users"
          description="Manage user accounts and permissions"
        />
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:max-w-md">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            User List ({userStats.totalUsers})
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            User Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            // statusFilter={statusFilter}
            // onStatusChange={setStatusFilter}
          />
          <UserTable users={processedUsers} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <UserStats {...userStats} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

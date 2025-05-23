import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import StatusDistributionBar from './StatusDistributionBar';
import { UserStatsProps } from '@/types/user';

export function UserStats({
  totalUsers,
  activeUsers,
  inactiveUsers,
  suspendedUsers,
  adminCount,
  userCount,
  isLoading
}: UserStatsProps) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-muted-foreground text-xs">
              {activeUsers} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount + userCount}</div>
            <p className="text-muted-foreground text-xs">
              {adminCount} Admins, {userCount} Users
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of user account statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <StatusDistributionBar
                label="Active"
                count={activeUsers}
                total={totalUsers}
                colorClass="bg-green-500"
              />
              {/* <StatusDistributionBar
                label="Inactive"
                count={inactiveUsers}
                total={totalUsers}
                colorClass="bg-yellow-500"
              />
              <StatusDistributionBar
                label="Suspended"
                count={suspendedUsers}
                total={totalUsers}
                colorClass="bg-red-500"
              /> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserStats;

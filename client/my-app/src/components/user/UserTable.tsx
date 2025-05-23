import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserTableProps } from '@/types/user';
import { getRoleBadge, getStatusBadge } from './UserBadge';

export function UserTable({ users, isLoading }: UserTableProps) {
  return (
    <div className="mt-6 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="text-center">Role</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="text-primary h-6 w-6 animate-spin" />
                  <span>Loading users...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No users found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.usr_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={
                          `${process.env.NEXT_PUBLIC_API_URL_IPFS}${user.usr_avatar}` ||
                          '/placeholder.svg'
                        }
                        alt={user.usr_name}
                      />
                      <AvatarFallback>
                        {user.usr_name?.charAt(0).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.usr_name}</div>
                      <div className="text-muted-foreground text-xs md:hidden">
                        {user.usr_email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.usr_email}
                </TableCell>
                <TableCell className="text-center">
                  {getRoleBadge(user.usr_role)}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(user.usr_status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default UserTable;

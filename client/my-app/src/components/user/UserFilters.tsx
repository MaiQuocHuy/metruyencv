import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ROLES, STATUSES } from '@/lib/constants/user';
import { FILTER_ALL } from '@/lib/constants/user';
import { UserFiltersProps } from '@/types/user';

export function UserFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1 space-y-1">
        <Label htmlFor="search-users" className="text-sm">
          Search
        </Label>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            id="search-users"
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search users by name or email"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="space-y-1">
          <Label htmlFor="role-filter" className="text-sm">
            Role
          </Label>
          <Select
            value={roleFilter}
            onValueChange={onRoleChange as (value: string) => void}
          >
            <SelectTrigger id="role-filter" className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FILTER_ALL}>All Roles</SelectItem>
              {Object.values(ROLES).map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <div className="space-y-1">
          <Label htmlFor="status-filter" className="text-sm">
            Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={onStatusChange as (value: string) => void}
          >
            <SelectTrigger id="status-filter" className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FILTER_ALL}>All Status</SelectItem>
              {Object.values(STATUSES).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </div>
    </div>
  );
}

export default UserFilters;

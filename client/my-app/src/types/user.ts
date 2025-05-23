import { ROLES, STATUSES, FILTER_ALL } from '@/lib/constants/user';
import { User } from '@/services/apiUser';

export interface FavoriteManga {
  manga_id: number;
  manga_title: string;
  manga_thumb: string;
  manga_description?: string;
}

export interface UpdateUserProfileRequest {
  userId: number;
  data: FormData;
}

// Role types
export type RoleId = keyof typeof ROLES;
export type RoleName = (typeof ROLES)[RoleId]['name'];

// Status type
export type Status = (typeof STATUSES)[keyof typeof STATUSES];

// Filter types
export type FilterValue = typeof FILTER_ALL | RoleName | Status;

// Props interfaces for components
export interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: typeof FILTER_ALL | RoleName;
  onRoleChange: (value: typeof FILTER_ALL | RoleName) => void;
  statusFilter?: typeof FILTER_ALL | Status;
  onStatusChange?: (value: typeof FILTER_ALL | Status) => void;
}

export interface UserTableProps {
  users: User[];
  isLoading: boolean;
}

export interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  adminCount: number;
  userCount: number;
  isLoading: boolean;
}

export interface StatusDistributionBarProps {
  label: string;
  count: number;
  total: number;
  colorClass: string;
}

// Re-export User type from API for convenience

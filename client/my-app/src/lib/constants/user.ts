// Constants for user roles
export const USER_ROLE_ID = 1 as const;
export const ADMIN_ROLE_ID = 2 as const;

export const ROLES = {
  [USER_ROLE_ID]: { id: USER_ROLE_ID, name: 'user', label: 'User' },
  [ADMIN_ROLE_ID]: { id: ADMIN_ROLE_ID, name: 'admin', label: 'Admin' }
} as const;

// Constants for user statuses
export const STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
} as const;

// Filter constant
export const FILTER_ALL = 'all' as const;

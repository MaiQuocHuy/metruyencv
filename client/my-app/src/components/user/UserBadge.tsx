import { ROLES } from '@/lib/constants/user';
import { Badge } from '../ui/badge';

import { ADMIN_ROLE_ID, USER_ROLE_ID } from '@/lib/constants/user';
import { RoleId } from '@/types/user';
import { STATUSES } from '@/lib/constants/user';

export const getRoleBadge = (
  roleId: number | undefined
): React.ReactElement => {
  // Handle undefined roleId gracefully
  if (roleId === undefined) {
    console.warn('Undefined role ID received');
    return <Badge variant="outline">Unknown</Badge>;
  }

  const role = ROLES[roleId as RoleId];

  // Handle invalid roleId gracefully
  if (!role) {
    console.warn('Unknown role ID:', roleId);
    return <Badge variant="outline">Unknown</Badge>;
  }

  switch (role.name) {
    case ROLES[ADMIN_ROLE_ID].name:
      return (
        <Badge variant="default" className="bg-primary">
          {role.label}
        </Badge>
      );
    case ROLES[USER_ROLE_ID].name:
      return <Badge variant="outline">{role.label}</Badge>;
    default:
      // This case should theoretically not be reached if ROLES is exhaustive
      return <Badge variant="outline">Unknown</Badge>;
  }
};

/**
 * Returns a badge component for a given status
 */
export const getStatusBadge = (
  status: string | undefined
): React.ReactElement => {
  // Handle undefined status gracefully
  if (!status) {
    return <Badge variant="outline">Unknown</Badge>;
  }

  switch (status) {
    case STATUSES.ACTIVE:
      return (
        <Badge
          variant="outline"
          className="border-green-200 bg-green-50 text-green-600 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400"
        >
          Active
        </Badge>
      );
    case STATUSES.INACTIVE:
      return (
        <Badge
          variant="outline"
          className="border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900/30 dark:bg-yellow-900/20 dark:text-yellow-400"
        >
          Inactive
        </Badge>
      );
    case STATUSES.SUSPENDED:
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
        >
          Suspended
        </Badge>
      );
    default:
      return <Badge variant="outline">{status || 'Unknown'}</Badge>;
  }
};

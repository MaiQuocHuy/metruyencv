import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const GUEST_ROLE = 'guest';

export const Roles = (params: { action: string; resource: string }) =>
  SetMetadata(ROLES_KEY, params);

export const GuestRole = (guest: boolean = true) =>
  SetMetadata(GUEST_ROLE, guest);

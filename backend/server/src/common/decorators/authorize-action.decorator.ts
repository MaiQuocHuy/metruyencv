import { applyDecorators, UseGuards } from '@nestjs/common';

import { Roles } from './roles.decorator'; // Update this import to your roles decorator path
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';

interface RoleAction {
  action: string;
  resource: string;
}

export function AuthorizeAction(roleAction: RoleAction) {
  return applyDecorators(Roles(roleAction), UseGuards(AuthGuard, RolesGuard));
}

import { GUEST, RoleSlug } from '@common/constants';
import { GUEST_ROLE, ROLES_KEY } from '@common/decorators/roles.decorator';
import { AuthService } from '@modules/auth/auth.service';
import { UserService } from '@modules/user/user.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControl } from 'accesscontrol';
import { CacheService } from 'src/shared/cache/cache.service';
@Injectable()
export class RolesGuard implements CanActivate {
  ac: AccessControl;
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private cacheService: CacheService,
  ) {
    this.ac = new AccessControl();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.get<object>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    let grantList: any = await this.cacheService.get('grants_list');
    if (!grantList) {
      grantList = await this.authService.roleList(); //* => we should use cache or export it to json file, We don't need to access the DB every time we call the API anymore
      await this.cacheService.set('grants_list', grantList);
    }
    this.ac.setGrants(grantList);

    let role = '';
    if (req.user && req.user.sub) {
      // If user is authenticated
      role = await this.userService.getRoleOfUser(req.user.sub);
    } else {
      role = GUEST;
      const roleName = await this.authService.getRoleByRoleSlug(RoleSlug.USER);
      const attributesOfUserRole = this.ac
        .can(roleName)
        [requiredRoles['action']](requiredRoles['resource']).attributes;
      this.ac
        .grant(role)
        [
          requiredRoles['action']
        ](requiredRoles['resource'], attributesOfUserRole);
    }
    // Check permissions
    const permission = this.ac
      .can(role)
      [requiredRoles['action']](requiredRoles['resource']);

    req.permission = permission;
    return permission['granted'];
  }
}

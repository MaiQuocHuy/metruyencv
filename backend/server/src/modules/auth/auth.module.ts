import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { Role } from './models/role.model';
import { Resource } from './models/resource.model';
import { RoleGrants } from './models/rolegrants.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { KeyToken } from './models/keyToken.model';
import { AuthRepo } from './auth.repo';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from 'src/shared/cache/cache.module';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepo],
  imports: [
    SequelizeModule.forFeature([Role, Resource, RoleGrants, KeyToken]),
    JwtModule.register({
      global: true,
    }),
    UserModule,
    CacheModule,
  ],
  exports: [SequelizeModule, AuthService, AuthRepo, UserModule, CacheModule],
})
export class AuthModule {}

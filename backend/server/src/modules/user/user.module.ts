import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepo } from './user.repo';
import { AuthModule } from '@modules/auth/auth.module';
import { FavoriteModule } from '@modules/favorite/favorite.module';
import { PinataModule } from 'src/shared/pinata/pinata.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), FavoriteModule, PinataModule],
  controllers: [UserController],
  providers: [UserRepo, UserService],
  exports: [SequelizeModule, UserRepo, UserService],
})
export class UserModule {}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { UserRepo } from './user.repo';
import { AuthRepo } from '@modules/auth/auth.repo';
import Util from '@common/services/util.service';
import { AuthService } from '@modules/auth/auth.service';
import { FavoriteRepo } from '@modules/favorite/favorite.repo';
import { Favorite } from '@modules/favorite/models/favorite.model';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PinataService } from 'src/shared/pinata/pinata.service';
import { UserDto } from './dto/user.dto';
import { PaginatedDto } from 'src/shared/dto/paginate.dto';
import PaginateUtil from 'src/shared/utils/paginate.util';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly util: Util,
    private readonly authService: AuthService,
    private readonly authRepo: AuthRepo,
    private readonly favoriteRepo: FavoriteRepo,
    private readonly pinataService: PinataService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<object> {
    const user: User = await this.userRepo.findUserByEmail(
      createUserDto.usr_email,
    );
    if (user) {
      throw new HttpException(
        'User already registered! ',
        HttpStatus.BAD_REQUEST,
      );
    }

    // const passwordHash = await hash(createUserDto.usr_password, 10);
    const passwordHash = await this.createPasswordHash(
      createUserDto.usr_password,
    );
    createUserDto.usr_password = passwordHash;

    const userId: number = this.util.generateIdByTime();
    const userSlug: string = this.util.generateSlug([
      createUserDto.usr_name,
      Math.floor(userId / 1000).toString(),
    ]);
    const newUser = await this.userRepo.createNewUser(
      new User({
        usr_id: userId,
        usr_slug: userSlug,
        usr_role: 1,
        ...createUserDto,
      }),
    );

    if (newUser) {
      const { keyForAccessToken, keyForRefreshToken } =
        this.authService.createKeyForAccessAndRefreshToken();

      const payload = { sub: newUser.usr_id, email: newUser.usr_email };
      const { accessToken, refreshToken } =
        await this.authService.createKeyTokenPair(
          payload,
          keyForAccessToken,
          keyForRefreshToken,
        );

      // add key and token to database
      const keyStore = await this.authRepo.createKeyToken({
        id: this.util.generateIdByTime(),
        user_id: newUser.usr_id,
        refresh_key: keyForRefreshToken,
        public_key: keyForAccessToken,
        refresh_token: refreshToken,
      });
      if (!keyStore)
        throw new HttpException(
          'Cannot create key token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      // create favorite storage for user, if create failed, this func also continue execute
      const favoriteId = this.util.generateIdByTime({ fitWithInteger: true });
      await this.favoriteRepo.createFavoriteStorage(
        new Favorite({
          fav_id: favoriteId,
          fav_user_id: newUser.usr_id,
        }),
      );

      return {
        user: this.util.getInfoData({
          fields: ['usr_id', 'usr_name', 'usr_email'],
          object: newUser,
        }),
        tokens: { access_token: accessToken, refresh_token: refreshToken },
      };
    }
    throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
  }

  async getRoleOfUser(userId: number): Promise<string> {
    const user = await this.userRepo.getUserRoleByUserId(userId);
    return user.role.role_name;
  }

  async getRoleSlugOfUser(userId: number): Promise<string> {
    const user = await this.userRepo.getUserRoleByUserId(userId);
    return user.role.role_slug;
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<number> {
    const { oldPassWord, newPassword } = changePasswordDto;
    const foundUser = await this.userRepo.findUserById(userId);

    const matchOldPassword = await compare(oldPassWord, foundUser.usr_password);
    if (!matchOldPassword)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    const matchNewPassword = await compare(newPassword, foundUser.usr_password);
    if (matchNewPassword)
      throw new HttpException(
        'New password must be different from old password',
        HttpStatus.BAD_REQUEST,
      );

    const newPasswordHash = await this.createPasswordHash(newPassword);
    const isUpdated = await this.userRepo.updatePassword(
      newPasswordHash,
      userId,
    );
    if (!isUpdated)
      throw new HttpException(
        'Cannot update password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return isUpdated;
  }

  async createPasswordHash(password: string): Promise<string> {
    return await hash(password, 10); // should generate a random salt for user, then save it to database
  }

  async updateUserProfile(
    userId: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<number> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const { usr_sex, usr_name } = updateUserDto;
    user.usr_sex = usr_sex;
    user.usr_name = usr_name;

    if (file) {
      const uploadAvatar = await this.pinataService.uploadFile(
        file,
        `avatar-${user.usr_id}`,
      );
      user.usr_avatar = uploadAvatar['IpfsHash'];
    }
    const isUpdated = await this.userRepo.updateProfile(user, userId);
    if (!isUpdated)
      throw new HttpException(
        'Cannot update user profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return isUpdated;
  }

  async getListUserWithPaginate(
    paginateDto: PaginatedDto<UserDto>,
  ): Promise<PaginatedDto<UserDto>> {
    const page = paginateDto.page;
    const limit = paginateDto.limit;
    const { data, pagination } = await this.userRepo.getListUserPaginate(
      page,
      limit,
      {
        raw: true,
      },
    );
    paginateDto = PaginateUtil.setPaginateDto(paginateDto, data, pagination);
    return paginateDto;
  }

  async getDetailsInfo(userId: number): Promise<User> {
    let user = await this.userRepo.findUserById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    user = this.util.getInfoData({
      fields: ['usr_id', 'usr_name', 'usr_email', 'usr_avatar', 'usr_sex'],
      object: user,
    }) as User;
    return user;
  }
}

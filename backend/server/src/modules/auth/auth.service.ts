import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CryptoJS from 'crypto-js';
import { SignInDto } from './dto/sign-in.dto';
import { AuthRepo } from './auth.repo';
import { UserRepo } from '@modules/user/user.repo';
import { compare } from 'bcrypt';
import Util from '@common/services/util.service';
import { KeyToken } from './models/keyToken.model';
import _ from 'lodash';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepo,
    private authRepo: AuthRepo,
    private util: Util,
  ) {}

  async signIn(data: SignInDto): Promise<object> {
    const foundUser = await this.userRepo.findUserByEmail(data.usr_email);
    if (!foundUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const matchPassword = await compare(
      data.usr_password,
      foundUser.usr_password,
    );
    if (!matchPassword)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    const { keyForAccessToken, keyForRefreshToken } =
      this.createKeyForAccessAndRefreshToken();

    const payload = { sub: foundUser.usr_id, email: foundUser.usr_email };
    const { accessToken, refreshToken } = await this.createKeyTokenPair(
      payload,
      keyForAccessToken,
      keyForRefreshToken,
    );

    const updatedData: any = {
      user_id: foundUser.usr_id,
      public_key: keyForAccessToken,
      refresh_key: keyForRefreshToken,
      refresh_token: refreshToken,
    };
    if (!(await this.authRepo.findKeyTokenByUserId(foundUser.usr_id))) {
      const keyTokenId = this.util.generateIdByTime();
      updatedData.id = keyTokenId;
    }
    const isUpdateKey =
      this.authRepo.updateOrCreateKeyTokenByUserId(updatedData);
    if (!isUpdateKey)
      throw new HttpException(
        'Failed to update key token',
        HttpStatus.BAD_REQUEST,
      );

    return {
      user: this.util.getInfoData({
        fields: ['usr_id', 'usr_name', 'usr_email'],
        object: foundUser,
      }),
      tokens: { access_token: accessToken, refresh_token: refreshToken },
    };
  }

  async logout(keyStore: KeyToken): Promise<any> {
    const delKey = await this.authRepo.deleteKeyTokenById(keyStore.id);
    return delKey;
  }

  async handleRefreshToken(
    refreshToken: string,
    user: { sub: number; email: string },
    keyStore: KeyToken,
  ): Promise<object> {
    const { sub: userId, email } = user;

    const refreshTokensUsed: string[] = keyStore.refresh_tokens_used
      ? (keyStore.refresh_tokens_used as string[])
      : [];
    if (refreshTokensUsed.includes(refreshToken)) {
      this.authRepo.deleteKeyTokenByUserId(userId);
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    }

    if (keyStore.refresh_token != refreshToken) {
      throw new HttpException('Something went wrong', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: userId, email: email };
    const { accessToken: access_token, refreshToken: refresh_token } =
      await this.createKeyTokenPair(
        payload,
        keyStore.public_key,
        keyStore.refresh_key,
      );

    refreshTokensUsed.push(refreshToken);
    const isUpdated = this.authRepo.updateRefreshTokenUsedByUserId(
      userId,
      refresh_token,
      refreshTokensUsed,
    );
    if (!isUpdated)
      throw new HttpException('Something went wrong', HttpStatus.UNAUTHORIZED);

    return {
      user: { userId, email },
      token: { access_token, refresh_token },
    };
  }

  async createKeyTokenPair(
    payload: object,
    keyForAccessToken: string,
    keyForRefreshToken: string,
  ): Promise<Record<string, string>> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: keyForAccessToken,
      expiresIn: '2 days',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: keyForRefreshToken,
      expiresIn: '7 days',
    });
    return { accessToken, refreshToken };
  }

  createKeyForAccessAndRefreshToken(): {
    keyForAccessToken: string;
    keyForRefreshToken: string;
  } {
    const keyForAccessToken = CryptoJS.lib.WordArray.random(64).toString(
      CryptoJS.enc.Hex,
    );
    const keyForRefreshToken = CryptoJS.lib.WordArray.random(64).toString(
      CryptoJS.enc.Hex,
    );
    return { keyForAccessToken, keyForRefreshToken };
  }

  async roleList(): Promise<Array<object>> {
    const roleGrants = await this.authRepo.getAllRoleGrants();

    const grantList = _.flatMap(roleGrants, (grant) => {
      const actions = _.castArray(grant.grant_action);

      return _.map(actions, (action) => ({
        role: grant.role.role_name,
        resource: grant.resource.src_name,
        action,
        attributes: grant.grant_attributes,
      }));
    });
    return grantList;
  }

  async getRoleByRoleSlug(roleSlug: string): Promise<string> {
    const role = await this.authRepo.getRoleByRoleSlug(roleSlug);
    return role.role_name;
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { GuestRole, Roles } from '@common/decorators/roles.decorator';
import { CacheService } from 'src/shared/cache/cache.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerApiOperation } from '@common/constants';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  @ApiOperation({
    summary: 'User & Admin login',
    description: `
  - **${SwaggerApiOperation.NOT_REQUIRE_CLIENT_ID}**
  - Return some **specific information**, **access token** & **refresh token**
    `,
  })
  @ApiBody({
    type: SignInDto,
    description: `
  - In the Examples have two type account of **normal user** and **admin**
  - You can use directly the **Examples** below to test
    `,
    examples: {
      admin: {
        value: {
          usr_email: 'admin123@gmail.com',
          usr_password: 'admin123',
        } as SignInDto,
      },
      user: {
        value: {
          usr_email: 'user123@example.com',
          usr_password: 'user123',
        } as SignInDto,
      },
    },
  })
  @HttpCode(200)
  @ResponseMessage('User signed in successfully')
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return {
      metadata: await this.authService.signIn(signInDto),
    };
  }

  @ApiOperation({
    summary: 'User & Admin logout',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - **Delete** all key and token of user (include '**public key**', '**refresh key**', '**refresh token**')
    `,
  })
  @HttpCode(200)
  @ResponseMessage('Logout success')
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    return {
      metadata: await this.authService.logout(req['keyStore']),
    };
  }

  @ApiOperation({
    summary: 'User & Admin authentication tokens',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - This route use to test verify token.
    `,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @ResponseMessage('Verify Token successfully')
  @UseGuards(AuthGuard)
  @Get('auth-token')
  async AuthToken(@Req() req: Request) {
    return {
      metadata: req['user'],
    };
  }

  @ApiOperation({
    summary: 'User & Admin handle refresh token',
    description: `
  - **${SwaggerApiOperation.NEED_AUTH}**
  - This route use to **verify refresh token**, then **provide new access token**.
  - **Delete** all key and token of user if **refresh token has been used**.
    `,
  })
  @ApiHeader({
    name: 'x-refresh-token',
    required: true,
    description: 'Set you refresh token',
  })
  @HttpCode(200)
  @ResponseMessage('Handle refresh token successfully')
  @UseGuards(AuthGuard)
  @Post('handle-refresh-token')
  async handleRefreshToken(@Req() req: Request) {
    return {
      metadata: await this.authService.handleRefreshToken(
        req['refreshToken'],
        req['user'],
        req['keyStore'],
      ),
    };
  }

  @ApiExcludeEndpoint()
  @HttpCode(200)
  @ResponseMessage('Test Auth Role Successfully ')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @GuestRole(true)
  @Roles({ action: 'readAny', resource: 'Category' })
  @Get('test-auth-role')
  async authRole(@Req() req: Request) {
    return {
      metadata: 'You can access this resource',
    };
  }

  @ApiExcludeEndpoint()
  @HttpCode(200)
  @ResponseMessage('Get cache successfully')
  @Get('test-cache')
  async testCache() {
    const cacheKey = 'key';
    let data = '';
    data = await this.cacheService.get(cacheKey);
    if (!data) {
      // Simulate fetching data from an external API
      await this.cacheService.set(cacheKey, data, '1m'); // Cache for 1 minute
    }

    return {
      metadata: {
        data,
      },
    };
  }
}

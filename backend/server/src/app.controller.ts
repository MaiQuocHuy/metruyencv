import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   // console.log(`process.env.DATABASE_USER::${process.env.DATABASE_USER}`);
  //   // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //   return this.appService.getHello();
  // }
}

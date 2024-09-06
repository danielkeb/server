import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}

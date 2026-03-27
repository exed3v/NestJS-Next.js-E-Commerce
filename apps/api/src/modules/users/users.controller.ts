import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtUser } from '../../common/interfaces/jwt-payload';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('')
  getAllUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUser(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    return this.userService.getUser(id, req.user);
  }

  @Post('')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Req() req: { user: JwtUser },
  ) {
    return this.userService.updateUser(id, body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    return this.userService.deleteUser(id, req.user);
  }
}

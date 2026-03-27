import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieves a list of all registered users. Requires ADMIN role.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
    schema: {
      example: [
        {
          id: 'cm8x1a2b3c4d5e6f7g8h9i0j',
          fullName: 'John Doe',
          email: 'john@example.com',
          role: 'USER',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - User does not have ADMIN role',
  })
  getAllUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieves a specific user. Users can only access their own data unless they are ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 'cm8x1a2b3c4d5e6f7g8h9i0j',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
    schema: {
      example: {
        id: 'cm8x1a2b3c4d5e6f7g8h9i0j',
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Cannot access another user's data",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  getUser(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    return this.userService.getUser(id, req.user);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Registers a new user. No authentication required.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    schema: {
      example: {
        id: 'cm8x1a2b3c4d5e6f7g8h9i0j',
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Validation failed or email already in use',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - Email already registered',
  })
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user',
    description:
      'Updates user information. Users can only update their own data unless they are ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 'cm8x1a2b3c4d5e6f7g8h9i0j',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    schema: {
      example: {
        id: 'cm8x1a2b3c4d5e6f7g8h9i0j',
        fullName: 'John Doe Updated',
        email: 'john.updated@example.com',
        role: 'USER',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:35:00Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Cannot update another user's data",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - Email already in use by another user',
  })
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Req() req: { user: JwtUser },
  ) {
    return this.userService.updateUser(id, body, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    description:
      'Deletes a user. Users can only delete their own account unless they are ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 'cm8x1a2b3c4d5e6f7g8h9i0j',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Cannot delete another user's account",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  deleteUser(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    return this.userService.deleteUser(id, req.user);
  }
}

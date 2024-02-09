import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  UserInterceptor,
  UserSignupInterceptor,
} from 'src/interceptor/interceptor';
import { AdminAuthGuard } from 'src/guards/admin-role.guard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserIdRole } from 'src/interfaces';
import { User } from './user.model';
import { GetUserId } from './userId.decorator';
import { UserLoginDto, UserSignupDto, UserUpdateDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Login route
  @Post('user/login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: UserLoginDto, @Res() res: Response): Promise<void> {
    try {
      // Attempt to login and obtain a token from the service
      const token = await this.userService.login(body);

      // Set the token in a cookie
      res.cookie('jwtToken', token, { httpOnly: true });

      // Send a success response
      res.send(`Token :- ${token}       Login Successful`);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Signup route
  @Post('user/signup')
  @UsePipes(ValidationPipe)
  @UseInterceptors(UserSignupInterceptor)
  async signup(@Body() body: UserSignupDto): Promise<string> {
    try {
      return this.userService.signUp(body);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  // Update User route
  @Put('user/')
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  @UseInterceptors(UserInterceptor)
  async updateUser(
    @GetUserId() { userId }: UserIdRole,
    @Body() body: UserUpdateDto,
  ): Promise<string> {
    try {
      return this.userService.updateUser(userId, body);
    } catch (error) {
      console.error('Error during update user:', error);
      throw error;
    }
  }

  // Delete User route
  @Delete('user/')
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  async deleteData(@GetUserId() { userId }: UserIdRole): Promise<string> {
    try {
      return this.userService.deleteData(userId);
    } catch (error) {
      console.error('Error during delete data:', error);
      throw error;
    }
  }

  // Logout route
  @Get('user/logout')
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  async logout(@Res() res: Response): Promise<void> {
    try {
      this.userService.logout(res);
      res.status(200).send('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  // View Particular user route
  @Get('user/')
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  async viewUser(@GetUserId() { userId }: UserIdRole): Promise<User> {
    try {
      return this.userService.viewUser(userId);
    } catch (error) {
      console.error('Error during view user:', error);
      throw error;
    }
  }

  // View Particular admin user route
  @Get('/admin/users')
  @UseGuards(AdminAuthGuard)
  @ApiSecurity('JWT-auth')
  async fetchUserList(@Query('name') name: string): Promise<User[]> {
    try {
      return this.userService.fetchUserList(name);
    } catch (error) {
      console.error('Error during view user:', error);
      throw error;
    }
  }
}

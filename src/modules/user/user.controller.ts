import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserInterceptor } from 'src/interceptor/interceptor';

import { UserLoginDto, UserSignupDto, UserUpdateDto } from './dto/user.dto';
import { User } from './user.model';
import { UserService } from './user.service';
import { GetUserId } from './userId.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Login route
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: UserLoginDto, @Res() res: Response): Promise<void> {
    try {
      // Attempt to login and obtain a token from the service
      const token = await this.userService.login(body);

      // Set the token in a cookie
      res.cookie('jwtToken', token, { httpOnly: true });

      // Send a success response
      res.send('Login Successful');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Signup route
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() body: UserSignupDto): Promise<string> {
    try {
      return this.userService.signUp(body);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  // Update User route
  @Put('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  async updateUser(
    @GetUserId() userId: string,
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
  @Delete('/')
  @UseGuards(AuthGuard)
  async deleteData(@GetUserId() userId: string): Promise<string> {
    try {
      return this.userService.deleteData(userId);
    } catch (error) {
      console.error('Error during delete data:', error);
      throw error;
    }
  }

  // Logout route
  @Get('/logout')
  @UseGuards(AuthGuard)
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
  @Get('/')
  @UseGuards(AuthGuard)
  async viewUser(@GetUserId() userId: string): Promise<User> {
    try {
      return this.userService.viewUser(userId);
    } catch (error) {
      console.error('Error during view user:', error);
      throw error;
    }
  }
}

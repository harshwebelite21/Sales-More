import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth_guard/authGuard';
import { User, UserLogin, UserUpdate } from './user.model';
import { GetUserId } from './userId.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Login route
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: UserLogin, @Res() res: Response): Promise<void> {
    try {
      // Attempt to login and obtain a token from the service
      if (!body) {
        throw Error('User Data Not Found');
      }
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
  async signup(@Body() body: User): Promise<string> {
    try {
      if (!body) {
        throw Error('User Data Not Found');
      }
      return this.userService.signUp(body);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  // Update User route
  @Put('/')
  @UseGuards(AuthGuard)
  async updateUser(
    @GetUserId() userId: string,
    @Body() body: UserUpdate,
  ): Promise<string> {
    try {
      if (!userId && !body) {
        throw Error('UserId and UserData Not Found');
      }
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
      if (!userId) {
        throw Error('UserId Not Found');
      }
      return this.userService.deleteData(userId);
    } catch (error) {
      console.error('Error during delete data:', error);
      throw error;
    }
  }

  // Logout route
  @Get('/logout')
  async logout(@Res() res: Response): Promise<void> {
    try {
      // Clear the cookie by setting an empty value and an expired date
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
      if (!userId) {
        throw Error('UserId Not Found');
      }
      return this.userService.viewUser(userId);
    } catch (error) {
      console.error('Error during view user:', error);
      throw error;
    }
  }
}

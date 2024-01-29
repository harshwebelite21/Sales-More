import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Login route
  @Post('/login')
  async login(@Body() body: User, @Res() res: Response): Promise<string> {
    try {
      // Attempt to login and obtain a token from the service
      const token = await this.userService.login(body.email, body.password);

      // Assuming login is successful and token is generated
      if (token) {
        // Set the token in a cookie
        res.cookie('jwtToken', token, { httpOnly: true });

        // Send a success response
        return 'Login Successful';
      } else {
        // If login fails, return an error message
        return 'Invalid email or password';
      }
    } catch (error) {
      // Handle other errors, e.g., service errors
      console.error('Error during login:', error);
      return 'Internal server error';
    }
  }

  // Logout route
  @Get('/logout')
  async logout(@Res() res: Response) {
    // Clear the cookie by setting an empty value and an expired date
    this.userService.logout(res);

    // Send a success response
    res.status(200).send('Logout successful');
  }

  // Signup route
  @Post('/signup')
  async signup(@Body() body: User) {
    return await this.userService.signUp(
      body.name,
      body.email,
      body.password,
      body.age,
      body.birthdate,
    );
  }

  // Update User route
  @Put('/:userId')
  async updateUser(@Param('userId') userId: string, @Body() body: User) {
    return await this.userService.updateUser(
      userId,
      body.name,
      body.email,
      body.password,
      body.age,
      body.birthdate,
    );
  }

  // Delete User route
  @Delete('/:userId')
  async deleteData(@Param('userId') userId: string) {
    return this.userService.deleteData(userId);
  }

  // View Particular user route
  @Get('/:userId')
  async viewUser(@Param('userId') userId: string) {
    return this.userService.viewUser(userId);
  }
}

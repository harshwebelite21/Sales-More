import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Login route
  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<string> {
    try {
      // Attempt to login and obtain a token from the service
      const token = await this.userService.login(email, password);

      // Assuming login is successful and token is generated
      if (token) {
        // Set the token in a cookie
        res.cookie('jwtToken', token, { httpOnly: true });

        // Send a success response
        res.send('Login Successful');
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
  async logout(@Res() res: Response, @Req() req: Request) {
    // Clear the cookie by setting an empty value and an expired date
    this.userService.logout(res);

    // Send a success response
    res.status(200).send('Logout successful');
  }

  // Signup route
  @Post('/signup')
  async signup(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('age') age: number,
    @Body('birthdate') birthdate: Date,
  ) {
    return await this.userService.signUp(name, email, password, age, birthdate);
  }

  // Update User route
  @Put('/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('age') age: number,
    @Body('birthdate') birthdate: Date,
  ) {
    return await this.userService.updateUser(
      userId,
      name,
      email,
      password,
      age,
      birthdate,
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

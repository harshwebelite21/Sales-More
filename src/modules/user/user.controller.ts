import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'guards/auth.guard';
import {
  UserInterceptor,
  UserSignupInterceptor,
} from 'interceptor/interceptor';
import { appConfig } from 'config/appConfig';
import { AvatarValidationInterceptor } from 'interceptor/file.interceptor';
import { AdminAuthGuard } from 'guards/admin-role.guard';
import { Ticket } from 'modules/customer-support/customer-support.model';
import { UserIdRole } from 'interfaces';
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

  // All tickets of logged in user
  @Get('user/tickets')
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  async userTickets(@GetUserId() { userId }: UserIdRole): Promise<Ticket[]> {
    try {
      return this.userService.userTickets(userId);
    } catch (error) {
      console.error('Error during view Tickets:', error);
      throw error;
    }
  }

  // Upload Avatar
  @Post('user/upload-avatar')
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  @UseInterceptors(FileInterceptor('file'), AvatarValidationInterceptor)
  async uploadAvatar(
    @GetUserId() { userId }: UserIdRole,
    @UploadedFile() { path }: Express.Multer.File,
  ): Promise<string> {
    try {
      await this.userService.uploadAvatar(userId, path);
      return path;
    } catch (error) {
      console.error('Error during Adding Avatar:', error);
      throw error;
    }
  }

  // Download Image
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  @Get('user/download-image')
  async downloadAvatarFile(
    @Query('imagedata') imagedata: string,
    @Res() res: Response,
  ): Promise<void> {
    const serverUrl = appConfig.imageServerUrl;
    if (!serverUrl) {
      throw Error('Server url Not found');
    }
    // const finalUrl = serverUrl + imagedata;

    res.download(imagedata);
  }
}

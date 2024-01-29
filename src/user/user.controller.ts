import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res
} from '@nestjs/common'
import { UserService } from './user.service'
import { Response, Request } from 'express'
import { StringDecoder } from 'string_decoder'

@Controller('user')
export class UserController {
  constructor (private readonly userService: UserService) {}
  // LoginAuth route
  @Post('/login')
  async login (
    @Body('email') email: string,
      @Body('password') password: string
  ): Promise<string> {
    return await this.userService.login(email, password)
  }

  // Logout authRoute
  @Get('/logout')
  async logout (@Res() res: Response, @Req() req: Request) {
    // Clear the cookie by setting an empty value and an expired date
    res.cookie('jwtToken', '', { expires: new Date(0), httpOnly: true })

    // Redirect or send a response indicating successful logout
    res.redirect('/login') // Redirect to login page, for example
  }

  // Add New User or Signup
  @Post('/signup')
  async signup (
  @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('birthdate') birthdate: string,
    @Body('age') age: number
  ) {
    return await this.userService.signup(name, email, password, birthdate, age)
  }

  // Update User Data
  @Put('/')
  async updatedata (
  @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('birthdate') birthdate: string,
    @Body('age') age: number,
    @Body('userId') userId: StringDecoder
  ) {
    return await this.userService.updatedata(
      name,
      email,
      password,
      birthdate,
      age,
      userId
    )
  }

  // Delete User Data
  @Delete('/')
  async deletedata (@Body('userId') userId: string) {
    this.userService.deletedata(userId)
  }

  // View Particular user
  @Get('/')
  async viewuser (@Body('userId') userId: string) {
    this.userService.viewuser(userId)
  }
}

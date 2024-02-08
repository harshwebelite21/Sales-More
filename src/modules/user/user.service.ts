import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { Model } from 'mongoose';
import { generateJwtToken } from 'src/utils/jwt';

import { UserLoginDto, UserSignupDto, UserUpdateDto } from './dto/user.dto';
import { User } from './user.model'; // Assuming the model file is named user.model.ts
import { Cart } from '../cart/cart.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
  ) {}

  // Validate user login and generate JWT token
  async login(body: UserLoginDto): Promise<string | Error> {
    // Find user by email
    const { email, password } = body;
    const userData = await this.userModel.findOne({ email });

    if (!userData) {
      throw new Error('User not found');
    }

    const passwordValidation = await compare(password, userData.password); // Compare entered password with stored password
    if (!passwordValidation) {
      throw new Error('Invalid password');
    }
    // Generate JWT token
    const token = generateJwtToken(
      { userId: userData._id, role: userData.role },
      { expiresIn: '1d' },
    );

    return token; // Return the JWT token for successful login
  }

  // Add new user or Signup
  async signUp(body: UserSignupDto): Promise<string> {
    // Create and save the new user
    await this.userModel.create(body);
    return 'User added successfully';
  }

  // Update user data by userId
  async updateUser(userId: string, body: UserUpdateDto): Promise<string> {
    await this.userModel.findOneAndUpdate({ _id: userId }, body);
    return 'User data updated successfully';
  }

  // Delete user by userId
  async deleteData(userId): Promise<string> {
    await this.userModel.findByIdAndDelete(userId);
    // delete all carts that contain the deleted user
    await this.cartModel.findOneAndDelete({ userId });

    return 'User deleted successfully';
  }

  // Logout user by clearing the JWT token from the cookie
  async logout(res: Response): Promise<void> {
    res.clearCookie('jwtToken', { httpOnly: true });
  }

  // View user data by userId
  async viewUser(userId: string): Promise<User> {
    const userData = await this.userModel.findById(userId).lean();
    if (!userData) {
      throw new Error('User data not found');
    }
    return userData;
  }

  // View user data by userId
  async fetchUserList(name: string): Promise<User[]> {
    const regex = new RegExp(name, 'i');
    const userData = await this.userModel.find({ name: regex }).lean();

    if (!userData) {
      throw new Error('User data not found');
    }
    return userData;
  }
}

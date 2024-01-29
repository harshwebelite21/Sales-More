import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from './user.model'; // Assuming the model file is named user.model.ts
import { JwtService } from '../utils/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    // @InjectModel('Cart') private readonly cartModel: Model<Cart>
  ) {}

  // Add new user
  async signUp(name, email, password, age, birthdate): Promise<string> {
    try {
      console.log('Adding new user:', {
        name,
        email,
        age,
        birthdate,
        password,
      });

      // Create and save the new user
      await this.userModel.create({ name, email, birthdate, age, password });

      return 'User added successfully';
    } catch (err) {
      return `Error in user creation: ${err.message}`;
    }
  }

  // View user data by userId
  async viewUser(userId): Promise<string> {
    try {
      // Find user by userId and retrieve lean data
      const userData = await this.userModel.findById(userId).lean();
      console.log('User data:', userData);

      return `${JSON.stringify(userData)}`;
    } catch (err) {
      return `${err.message} + "Error fetching user data"`;
    }
  }

  // Update user data by userId
  async updateUser(
    userId: string,
    name: string,
    email: string,
    password: string,
    age: number,
    birthdate: Date,
  ): Promise<string> {
    try {
      console.log('Updating user data:', { name, email, age, birthdate });

      // Find and update user data by userId
      await this.userModel.findOneAndUpdate(
        { _id: userId },
        { name, email, birthdate, age, password },
      );

      return 'User data updated successfully';
    } catch (err) {
      return `${err.message} + "Error updating user data"`;
    }
  }

  // Delete user by userId
  async deleteData(userId): Promise<string> {
    try {
      // Delete the user from the user collection by userId
      await this.userModel.findByIdAndDelete(userId);

      return 'User deleted successfully';
    } catch (err) {
      return `${err.message} + "Error deleting user"`;
    }
  }

  // Logout user by clearing the JWT token from the cookie
  async logout(res: Response): Promise<void> {
    res.clearCookie('jwtToken', { httpOnly: true });
  }

  // Validate user login and generate JWT token
  async login(email, password): Promise<string> {
    try {
      // Find user by email
      const userData = await this.userModel.findOne({ email });

      if (!userData) {
        return 'User not found!';
      }

      // Compare entered password with stored password
      const passwordValidation = await bcrypt.compare(
        password,
        userData.password,
      );

      if (passwordValidation) {
        // Generate JWT token
        const token = this.jwtService.generateJwtToken(
          { userId: userData._id },
          { expiresIn: '1d' },
        );

        return token; // Return the JWT token for successful login
      } else {
        return 'Invalid password';
      }
    } catch (error) {
      return `Error during login: ${error}`;
    }
  }
}

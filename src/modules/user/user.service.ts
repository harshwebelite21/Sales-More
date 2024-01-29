import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { compare } from 'bcrypt';
import { User } from './user.model'; // Assuming the model file is named user.model.ts
import { generateJwtToken } from 'src/utils/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,

    // @InjectModel('Cart') private readonly cartModel: Model<Cart>
  ) {}

  // Add new user
  async signUp(name, email, password, age, birthdate): Promise<string> {
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
  }

  // View user data by userId
  async viewUser(userId): Promise<string> {
    // Find user by userId and retrieve lean data
    const userData = await this.userModel.findById(userId).lean();
    console.log('User data:', userData);

    return `${JSON.stringify(userData)}`;
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
    console.log('Updating user data:', { name, email, age, birthdate });

    // Find and update user data by userId
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { name, email, birthdate, age, password },
    );

    return 'User data updated successfully';
  }

  // Delete user by userId
  async deleteData(userId): Promise<string> {
    // Delete the user from the user collection by userId
    await this.userModel.findByIdAndDelete(userId);

    return 'User deleted successfully';
  }

  // Logout user by clearing the JWT token from the cookie
  async logout(res: Response): Promise<void> {
    res.clearCookie('jwtToken', { httpOnly: true });
  }

  // Validate user login and generate JWT token
  async login(email, password): Promise<string> {
    // Find user by email
    const userData = await this.userModel.findOne({ email });

    if (!userData) {
      return 'User not found!';
    }

    // Compare entered password with stored password
    const passwordValidation = await compare(password, userData.password);

    if (passwordValidation) {
      // Generate JWT token
      const token = generateJwtToken(
        { userId: userData._id },
        { expiresIn: '1d' },
      );

      return token; // Return the JWT token for successful login
    } else {
      return 'Invalid password';
    }
  }
}

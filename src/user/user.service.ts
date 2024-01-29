import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { type User } from './user.model'
import { type Cart } from 'src/cart/cart.model'
import * as bcrypt from 'bcrypt'
import { retry } from 'rxjs'

@Injectable()
export class UserService {
  constructor (
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>
  ) {}
  //     const bcrypt = require("bcrypt");
  // const userModel = require("../models/user");
  // const { generateJwtToken } = require("../utils/jwt");
  // const cartModel = require("../models/cart");

  //  Add new data
  async signup (name, email, age, birthdate, password): Promise<string> {
    try {
      await this.userModel.create({ name, email, birthdate, age, password })
      return 'Data Added successfully'
    } catch (err) {
      return `" Error in data Creation :" + ${err.message}`
    }
  }

  // View the user data
  async viewuser (userId): Promise<string> {
    try {
      const userData = await this.userModel.findById(userId).lean()
      return `${JSON.stringify(userData)}`
    } catch (err) {
      return `${err.message} + "Fetching data "`
    }
  }

  // Update the data using id
  async updatedata (
    name,
    email,
    birthdate,
    age,
    password,
    userId
  ): Promise<string> {
    try {
      await this.userModel.findOneAndUpdate(
        { _id: userId },
        { name, email, birthdate, age, password }
      )
      return 'Data Updated successful'
    } catch (err) {
      return `${err.message} + "Error in data Updating`
    }
  }

  //  Delete data
  async deletedata (userId) {
    try {
      // Delete the user from the user collection
      await this.userModel.findByIdAndDelete(userId)

      // delete all carts that contain the deleted user
      await this.cartModel.findOneAndDelete({ userId })
      return 'data deleted successfully'
    } catch (err) {
      return `${err.message} + "Data Deletion Unsuccessful"`
    }
  }

  // Login check
  async login (email, password): Promise<string> {
    try {
      const userData = await this.userModel.findOne({ email })

      if (!userData) {
        return 'User Not Found!'
      }

      // Compare
      const passwordValidation = await bcrypt.compare(
        password,
        userData.password
      )

      if (passwordValidation) {
        // Generate JWT token
        const token = generateJwtToken(
          { userId: userData._id },
          {
            expiresIn: '1d'
          }
        )

        // Setting cookie
        // const cookie=token;
        // res.cookie("jwtToken", token, { httpOnly: true });
        return token

        res.status(200).send(`Login successful And Token is :- ${token}`)
      } else {
        return 'Invalid PassWord'
      }
    } catch (error) {
      return `Error in login :- ${error}`
    }
  }

  // Logout
  // async logout(): = async (req, res) => {
  //     res.status(200).clearCookie("jwtToken").send("Logout Successful");
  //   };
}

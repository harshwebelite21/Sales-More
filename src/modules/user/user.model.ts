import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

// Define the user schema
export const UserSchema = new mongoose.Schema({
  // User name field
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
  },
  // User email field
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // Validate email using a regular expression
      validator: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  // User password field
  password: {
    type: String,
    required: true,
  },
  // User age field
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  // User birthdate field
  birthdate: {
    type: Date,
    required: true,
  },
});

// Middleware to encrypt password before saving new data
UserSchema.pre('save', async function (next) {
  const data = this;
  // Check if the password is modified before encrypting
  if (!data.isModified('password')) {
    next();
    return;
  }
  try {
    // Encrypt the password using bcrypt
    data.password = await bcrypt.hash(data.password, saltRounds);
  } catch (err) {
    next(err);
  }
});

// Middleware to encrypt password after updating password data
UserSchema.pre('findOneAndUpdate', async function (next) {
  const password = this.get('password');
  try {
    // Encrypt the updated password using bcrypt
    this.set('password', await bcrypt.hash(password, saltRounds));
  } catch (err) {
    next(err);
  }
});

// User interface extending mongoose.Document
export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
  birthdate: Date;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Document } from 'mongoose';
const saltRounds = 10;

// Define the user schema

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  age: number;

  @Prop({ type: Date, required: true })
  birthdate: Date;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Number, required: true, default: 2 })
  role: Role;
}
export const UserSchema = SchemaFactory.createForClass(User);

// Middleware to encrypt password before saving new data
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const data = this;
  // Check if the password is modified before encrypting
  if (!data.isModified('password')) {
    next();
    return;
  }
  try {
    // Encrypt the password using bcrypt
    data.password = await hash(data.password, saltRounds);
  } catch (err) {
    next(err);
  }
});

// Middleware to encrypt password after updating password data
UserSchema.pre('findOneAndUpdate', async function (next) {
  const password = this.get('password');
  try {
    // Encrypt the updated password using bcrypt
    this.set('password', await hash(password, saltRounds));
  } catch (err) {
    next(err);
  }
});

export enum Role {
  Admin = 1,
  User,
}

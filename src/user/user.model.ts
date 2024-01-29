import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
const saltRounds = 10

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        // Regular expression for email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(value)
      },
      message: (props) => `${props.value} is not a valid email address!`
    }
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  password: {
    type: String,
    required: true
  }
})
// To Encrypt Password while adding new data
UserSchema.pre('save', async function (next) {
  const data = this
  if (!data.isModified('password')) {
    next(); return
  }
  try {
    data.password = await bcrypt.hash(data.password, saltRounds)
  } catch (err) {
    next(err)
  }
})

// To Encrypt Password after updating password data
UserSchema.pre('findOneAndUpdate', async function (next) {
  const password = this.get('password')
  try {
    this.set('password', await bcrypt.hash(password, saltRounds))
  } catch (err) {
    next(err)
  }
})

export interface User extends mongoose.Document {
  userId: string
  birthdate: Date
  email: string
  age: number
  password: string
}

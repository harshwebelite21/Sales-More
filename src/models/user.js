const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;
const saltRounds = 10;

const userSchema = new schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        // Regular expression for email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  password: {
    type: String,
    required: true,
  },
});
// To Encrypt Password while adding new data
userSchema.pre("save", async function (value) {
  const data = this;
  if (!data.isModified("password")) {
    return value();
  }
  try {
    data.password = await bcrypt.hash(data.password, saltRounds);
  } catch (err) {
    return value(err);
  }
});

// To Encrypt Password after updating password data
userSchema.pre("findOneAndUpdate", async function (value) {
  const password = this.get("password");
  // console.log(password);
  // const data=this;
  // console.log(data._update.password, "Password data");

  try {
    // console.log(hashPassword)
    this.set("password", await bcrypt.hash(password, saltRounds));
  } catch (err) {
    return value(err);
  }
});

module.exports = mongoose.model("User", userSchema);

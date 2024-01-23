const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const { generateJwtToken } = require("../utils/jwt");
const cartModel = require("../models/cart");

//  Add new data
exports.signup = async (req, res) => {
  try {
    const { name, email, age, birthdate, password } = req.body;
    await userModel.create({ name, email, birthdate, age, password });
    res.status(201).send("Data Added successfully");
  } catch (err) {
    res.status(400).send(" Error in data Creation :" + err.message);
  }
};
// View the user data
exports.viewuser = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).lean();
    res.status(200).send(userData);
  } catch (err) {
    res.send(err.message + "Fetching data ").status(400);
  }
};

// Update the data using id
exports.updatedata = async (req, res) => {
  try {
    const { name, email, birthdate, age, password } = req.body;
    await userModel.findOneAndUpdate(
      { _id: req.userId },
      { name, email, birthdate, age, password }
    );
    res.status(201).send("Data Updated successful");
  } catch (err) {
    res.status(400).send(err.message + "Error in data Updating");
  }
};

//  Delete data
exports.deletedata = async (req, res) => {
  try {
    // Delete the user from the user collection
    await userModel.findByIdAndDelete(req.userId);

    // delete all carts that contain the deleted user
    await cartModel.findOneAndDelete({ userId: req.userId });

    res.status(200).send("data deleted successfully");
  } catch (err) {
    res.status(400).send(err.message + "Data Deletion Unsuccessful");
  }
};

// Login check
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await userModel.findOne({ email });

    if (!userData) {
      return res.status(401).send("User not found!");
    }

    // Compare
    const passwordValidation = await bcrypt.compare(
      password,
      userData.password
    );

    if (passwordValidation) {
      // Generate JWT token
      const token = generateJwtToken(
        { userId: userData._id },
        {
          expiresIn: "1d",
        }
      );

      // Setting cookie
      res.cookie("jwtToken", token, { httpOnly: true });

      res.status(200).send(`Login successful And Token is :- ${token}`);
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    res.send(`Error in login :- ${error}`);
  }
};

// Logout
exports.logout = async (req, res) => {
  res.status(200).clearCookie("jwtToken").send("Logout Successful");
};

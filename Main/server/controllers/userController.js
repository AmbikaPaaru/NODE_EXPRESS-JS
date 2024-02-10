const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const usersList = asyncHandler(async (req, res) => {
  try {
    if (req.user) {
      const currentUser = req.user;
      const users = await User.find({ _id: { $ne: currentUser.id } });
      res.status(200).json(users);
    } else {
      res.status(403);
      throw new Error(
        "Access denied. You must be a superadmin to list all users."
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error("Unable to fetch users");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const {username, email, role, password } = req.body;
  if (!username || !email || !role || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  const generateRandom4DigitNumber = () => {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId:generateRandom4DigitNumber().toString(),
      username, 
      email,
      role,
      password: hashedPassword,
    });
    
    if (user) {
      res
        .status(201)
        .json({ _id: user.userId, email: user.email, role: user.role });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  } catch (error) {
    console.error("Error during user registration:", error);
      console.error("Error during user registration:", error);
      res.status(500).json({ error: "Internal server error" });
   
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "60m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  // const contactsList = await Contacts.find();
  res.status(200).json(req.user);
});

const updateRole = asyncHandler(async (req, res) => {
  try {
    if (req.user && req.user.role === "superadmin") {
      const userId = req.params.id;
      const newRole = req.query.newRole;
      const newName = req.query.newName;

      const updates = {}; 

      if (newRole) {
        updates.role = newRole;
      }

      if (newName) {
        updates.username = newName;
      }

      if (Object.keys(updates).length === 0) {
        res.status(400);
        throw new Error("No valid updates provided");
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }
      Object.assign(user, updates);

      await user.save();
      res.status(200).json({ message: "User properties updated successfully" });
    } else {
      res.status(403);
      throw new Error("Access denied. You must be a superadmin to update user properties.");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

const removeUser = asyncHandler(async (req, res) => {
  const findUser = await User.findById(req.params.id);

  if (!findUser && !req.user.role === "superadmin") {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (findUser._id.toString() !== req.params.id) {
    console.log(findUser._id.toString(), req.params.id);
    res.status(403);
    throw new Error("User don't have permission to delete other contacts");
  }
  await User.deleteOne({ _id: req.params.id });
  res.status(200).json(findUser);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  usersList,
  updateRole,
  removeUser,
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;

const User = require("../models/user.model");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Validation error" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }
    const avatarURL = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      subscription: "starter",
      avatarURL,
    });

    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Validation error" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = req.user;

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const currentUser = req.user;
    const uploadedFilePath = req.file.path;
    const originalFileExtension = path.extname(req.file.originalname);
    const uniqueFileName = `${currentUser._id}${originalFileExtension}`;
    const avatarURL = `/avatars/${uniqueFileName}`;

    const image = await jimp.read(uploadedFilePath);
    image.resize(250, 250);
    await image.writeAsync(`tmp/${uniqueFileName}`);

    await fs.rename(`tmp/${uniqueFileName}`, `public${avatarURL}`);

    currentUser.avatarURL = avatarURL;
    await currentUser.save();

    return res.status(200).json({
      message: "Avatar updated successfully",
      avatarURL: currentUser.avatarURL,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateUserAvatar,
};

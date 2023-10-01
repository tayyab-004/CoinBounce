const Joi = require("joi");
const User = require("../models/user");
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  async register(req, res, next) {
    // validation of user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = userRegisterSchema.validate(req.body);

    // if error occured -> return error through middleware
    if (error) {
      return next(error);
    }

    // if usermame or password already registered -> return an error
    const { username, name, email, password } = req.body;

    // check if email already registered
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email Already exsists, try another email!",
        };

        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username Already exsists, try another username!",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // store data in DB
    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        username,
        email,
        name,
        password: hashedPassword,
      });

      user = await userToRegister.save();

      // generating token
      accessToken = JWTService.signAcessToken({ _id: user._id }, "30m");
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    // store refresh token in DB
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // sending tokens in cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    const userDto = new UserDTO(user);

    // sending response to user - with filtering
    return res.status(201).json({ user: userDto, auth: true });
  },
  async login(req, res, next) {
    // validation of user input
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });
    const { error } = userLoginSchema.validate(req.body);

    // if error occured -> return error through middleware
    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    // match username and password
    let user;
    try {
      // match username form exsisting users
      user = await User.findOne({ username });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid Username.",
        };

        return next(error);
      }

      // match password from exsisting user - hashed form
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password.",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAcessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh token in DB
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    const userDto = new UserDTO(user);

    // sending response to user - with filtering
    return res.status(200).json({ user: userDto, auth: true });
  },
  async logout(req, res, next) {
    // deleting refresh token from DB
    const { refreshToken } = req.cookies;

    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // deleting cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // sending response to user
    res.status(200).json({ user: null, auth: false });
  },
  async refresh(req, res, next) {
    // get refresh token from cookies
    const originalRefreshToken = req.cookies.refreshToken;

    // verifying the refresh token
    let id;
    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    // generating the new token
    try {
      const accessToken = JWTService.signAcessToken({ _id: id }, "30m");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      // updating DB and return response
      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });
      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    } catch (e) {
      return next(e);
    }

    const user = await User.findOne({ _id: id });
    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = authController;

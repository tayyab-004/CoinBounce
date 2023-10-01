const JWTService = require("../services/JWTService");
const User = require("../models/user");
const UserDTO = require("../dto/user");

const auth = async (req, res, next) => {
  try {
    // validating access and refresh token
    const { refreshToken, accessToken } = req.cookies;

    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }

    let _id;

    try {
      JWTService.verifyAcessToken(accessToken)._id;
    } catch (error) {
      return next(error);
    }

    let user;
    try {
      user = await User.findOne({ id: _id });
    } catch (error) {
      return next(error);
    }
    const userDto = new UserDTO(user);
    req.user = userDto;

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;

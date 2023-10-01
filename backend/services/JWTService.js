const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../config/index");
const RefreshToken = require("../models/token");

class JWTService {
  // sign access token
  static signAcessToken(playload, expiryTime) {
    return jwt.sign(playload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
  }

  // sign refresh token
  static signRefreshToken(playload, expiryTime) {
    return jwt.sign(playload, REFRESH_TOKEN_SECRET, { expiresIn: expiryTime });
  }

  // verify access token
  static verifyAcessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  // verify refresh token
  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }

  // store refresh token
  static async storeRefreshToken(token, userId) {
    try {
      const newToken = new RefreshToken({
        token: token,
        userId: userId,
      });
      // storing token to DB
      await newToken.save();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = JWTService;

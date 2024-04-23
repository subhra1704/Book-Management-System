const { sign, verify } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  createTokens: (user, time, _SECRET_KEY) => {
    const jti = Math.random().toString(36).substring(7);
    const accessToken = sign(
      {
        email: user.email,
        userId: user._id,
        role: user.role,
        type: user.type,
        jti,
      },
      _SECRET_KEY,
      { expiresIn: time }
    );
    return { accessToken, jti };
  },

  verifyTokens: (tokens, _SECRET_KEY) => {
    const decoded = verify(tokens, _SECRET_KEY);
    return decoded;
  },

  generateHash: async (data) => {
    return await bcrypt.hash(String(data), 10);
  },

  compareHash: async (data, hash) => {
    return await bcrypt.compare(data, hash);
  },


  generateOTP: () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = Date.now() + 10 * 60 * 1000; 
    return { otp, expiryTime };
  },
  


  createOTPTokens: (user, time, _SECRET_KEY) => {
    const jti = Math.random().toString(36).substring(7);
    const accessToken = sign(
      {
        email: user.email,
        userId: user._id,
        role: "OTP",
        jti,
      },
      _SECRET_KEY,
      { expiresIn: time }
    );
    return { accessToken, jti };
  },

};



const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userEnums = require("../utils/enum/user");
const accountEnums = require("../utils/enum/accountStatus");
const status = require("../utils/enum/status");
const { boolean } = require("joi");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },

    role: {
      type: String,
      enum: [userEnums.USER],
      default: userEnums.USER,
    },

    accountStatus: {
      type: String,
      enum: [
        accountEnums.ACTIVE,
        accountEnums.INACTIVE,
        accountEnums.SUSPENDED,
      ],
      default: accountEnums.ACTIVE,
    },

    isVerified: { type: Boolean, default: false },

    status: {
      type: String,
      enum: [status.ACTIVE, status.DELETE, status.BLOCK],
      default: status.ACTIVE,
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiryTime: {
    type: Number,
  },
  isExpired: { type: Boolean, default: false },
});

module.exports.otpSchema = mongoose.model("otps", otpSchema);

module.exports.userSchema = mongoose.model("users", userSchema);

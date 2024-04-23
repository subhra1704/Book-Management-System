const { userSchema, otpSchema } = require("./model");
const role = require("../utils/enum/user");

module.exports = {
  createUser: async (document) => {
    const response = await userSchema.create(document);
    return response;
  },

  findAllUser: async (filter) => {
    const response = await userSchema.find(filter);
    return response;
  },

  findOneUser: async (filter = {}, projection = {}) => {
    const response = await userSchema.findOne(filter, projection);
    return response;
  },

  findById: async (id) => {
    const response = await userSchema.findById(id).select("-password");
    return response;
  },

  updateUser: async (id, data) => {
    const res = await userSchema.findOneAndUpdate(
      { _id: id },
      { $set: { ...data } },
      { new: true }
    );
    return res;
  },

  createOTP: async (document) => {
    const response = await otpSchema.create(document);
    return response;
  },

  findOTP: async (filter) => {
    const response = otpSchema.findOne(filter);
    return response;
  },

  updateOTP: async (email, data) => {
    const res = await otpSchema.findOneAndUpdate(
      { email: email },
      { $set: { ...data } },
      { new: true }
    );
    return res;
  },

  deleteOTP: async (filter) => {
    return await otpSchema.deleteMany(filter);
  },
  updateOTP1: async (email, data) => {
    const res = await otpSchema.findOneAndUpdate(
      { email: email },
      { $set: { ...data } },
      { upsert: true }
    );
    return res;
  },
};

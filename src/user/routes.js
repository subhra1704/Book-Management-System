const express = require("express");
const routes = express.Router();
const {
  generalUserSignUp,
  verifyOtp,
  generalLogin,
  getUserById,
  resetUserPassword,
  updateUserPassword,
  changePassword,
  resendOtp,
} = require("./controller");
const { authorize, validateOTP } = require("../middleware/auth");

routes.post("/login", generalLogin);
routes.post("/signUp", generalUserSignUp);
routes.put("/verifyOTP", verifyOtp); // Step-2
routes.put("/resetUserPassword", resetUserPassword); // STEP-1
routes.put("/updateUserPassword", validateOTP, updateUserPassword); // STEP-4
routes.put("/changeUserPassword", authorize, changePassword);
routes.put("/resendOtp", resendOtp);
routes.get("/getUser", authorize, getUserById);

module.exports = routes;

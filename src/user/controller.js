const catchAsync = require("../utils/errorHandlers/catchAsync");
require("dotenv").config({ path: "./.env" });
const appError = require("../utils/errorHandlers/errorHandler");
const config=require("../config/config.json")
const {
  ErrorMessage,
  SuccessMessage,
} = require("../utils/commonMessages/message");
const {
  ErrorCode,
  SuccessCode,
} = require("../utils/commonStatusCode/statusCode");
const { commonResponse } = require("../utils/commonResponses/responses");
const helper = require("../utils/helper");
const services = require("../user/service");

const Joi = require("joi");

module.exports = {
  generalLogin: catchAsync(async (req, res) => {
    const validationSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    req.body.email = req.body.email.toLowerCase();

    const { error } = validationSchema.validate(req.body);
    if (error) {
      throw new appError(error.details[0].message, ErrorCode.BAD_REQUEST);
    }
    const { email, password } = req.body;
    const filter = { email: email };
    const user = await services.findOneUser(filter);
    if (!user)
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);

    const passwordMatch = await helper.compareHash(password, user.password);
    if (!passwordMatch)
      throw new appError(ErrorMessage.PWD_NOT_MATCH, ErrorCode.FORBIDDEN);

    if (!user.isVerified)
      throw new appError(
        ErrorMessage.USER_NOT_VERIFIED,
        ErrorCode.UNAUTHORIZED
      );

    const jwtToken = helper.createTokens(
      user,
      config.EXPIRY_JWT,
      config.ACCESS_JWT_KEY
    );

    return commonResponse(
      res,
      SuccessCode.SUCCESS,
      { access_token: jwtToken.accessToken, user: user },
      SuccessMessage.USER_LOGIN
    );
  }),

  generalUserSignUp: catchAsync(async (req, res) => {
    const validationSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().optional(),
    });
    const { error } = validationSchema.validate(req.body);
    if (error) {
      throw new appError(error.details[0].message, ErrorCode.BAD_REQUEST);
    }
    const payload = req.body;
    payload.email = payload.email.toLowerCase();

    const { email, password } = payload;
    let user = await services.findOneUser({ email });
    if (user) {
      throw new appError(
        ErrorMessage.EMAIL_ALREADY_EXIST,
        ErrorCode.ALREADY_EXIST
      );
    }

    payload["password"] = await helper.generateHash(password);
    payload["isVerified"] = false;
    const createOTP = helper.generateOTP();
    console.log(createOTP.otp);
    const hashedOTP = await helper.generateHash(createOTP.otp);
    await services.createOTP({
      email: payload.email,
      otp: hashedOTP,
      expiryTime: createOTP.expiryTime,
    });

    user = await services.createUser(payload);
    return commonResponse(
      res,
      SuccessCode.SUCCESS,
      { userData: user },
      SuccessMessage.SIGN_UP
    );
  }),

  verifyOtp: catchAsync(async (req, res) => {
    const validationSchema = Joi.object({
      email: Joi.string().email().required(),
      otp: Joi.string()
        .trim()
        .length(6)
        .message({
          "string.pattern.base": `OTP must have 6 digits numbers only.`,
        })
        .required(),
    });
    const { error, value: validatedBody } = validationSchema.validate(req.body);
    const { email, otp } = validatedBody;
    if (error)
      throw new appError(error.details[0].message, ErrorCode.BAD_REQUEST);

    const userData = await services.findOneUser({ email });
    if (!userData)
      throw new appError(
        ErrorMessage.UNREGISTERED_USER,
        ErrorCode.UNAUTHORIZED
      );

    const storedOTP = await services.findOTP({ email: email });
    if (storedOTP.expiryTime < Date.now())
      throw new appError(ErrorMessage.EXPIRED_OTP, ErrorCode.NO_LONGER_EXIST);

    if (storedOTP.isExpired)
      throw new appError(
        ErrorMessage.OPT_ALREADY_VERIFIED,
        ErrorCode.ALREADY_EXIST
      );

    const unhashedOTP = await helper.compareHash(otp, storedOTP.otp);

    let token = helper.createOTPTokens(
      userData,
      config.EXPIRY_JWT,
      config.ACCESS_JWT_KEY
    );

    if (userData.isVerified === false) {
      const response = await services.updateUser(userData._id, {
        isVerified: true,
      });
      if (!response)
        throw new appError(
          ErrorMessage.TRY_RESET_PASS,
          ErrorCode.SOMETHING_WRONG
        );
    }
    await services.updateOTP(email, { isExpired: true });
    commonResponse(
      res,
      SuccessCode.SUCCESS,
      token,
      SuccessMessage.OTP_VERIFIED
    );
  }),

  getUserById: catchAsync(async (req, res) => {
    const userId = req.user.userId;
    let user = await services.findById(userId);
    if (!user) {
      throw new appError(ErrorMessage.RECORD_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    commonResponse(res, SuccessCode.SUCCESS, user, SuccessMessage.RECORD_FOUND);
  }),

  resetUserPassword: catchAsync(async (req, res) => {
    let { email } = req.body;
    email = email.toLowerCase();
    const validationSchema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error } = validationSchema.validate({ email });
    if (error)
      throw new appError(error.details[0].message, ErrorCode.BAD_REQUEST);

    let user = await services.findOneUser({ email: email });
    if (!user)
      throw new appError(ErrorMessage.UNREGISTERED_USER, ErrorCode.NOT_FOUND);

    const createOTP = helper.generateOTP();
    const hashedOTP = await helper.generateHash(createOTP.otp);

     await services.updateOTP1(email, {
      email: email,
      otp: hashedOTP,
      expiryTime: createOTP.expiryTime,
      isExpired: false,
    });
    console.log(createOTP.otp);

    commonResponse(res, SuccessCode.CREATED, {}, SuccessMessage.MAIL_SENT);
  }),

  updateUserPassword: catchAsync(async (req, res) => {
    let { email, password } = req.body;

    const validationSchema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error } = validationSchema.validate({ email });
    if (error)
      throw new appError(error.details[0].message, ErrorCode.BAD_REQUEST);

    let user = await services.findOneUser({ email: email });
    if (!user)
      throw new appError(ErrorMessage.UNREGISTERED_USER, ErrorCode.NOT_FOUND);

    const newDoc = {
      password: await helper.generateHash(password),
    };

    const updatedData = await services.updateUserByEmail(email, newDoc);
    if (!updatedData)
      throw new appError(
        ErrorMessage.PASS_NOT_CHANGE,
        ErrorCode.SOMETHING_WRONG
      );

    commonResponse(
      res,
      SuccessCode.SUCCESS,
      updatedData,
      SuccessMessage.RECORD_UPDATED
    );
  }),

  changePassword: catchAsync(async (req, res) => {
    let { currentPassword, newPassword } = req.body;
    const filter = { _id: req.user.userId };
    const checkUser = await services.findOneUser(filter);
    if (!checkUser)
      throw new appError(ErrorMessage.UNREGISTERED_USER, ErrorCode.NOT_FOUND);
    if (!(await helper.compareHash(currentPassword, checkUser.password)))
      throw new appError(
        ErrorMessage.INCORRECT_PASSWORD,
        ErrorCode.BAD_REQUEST
      );
    if (currentPassword === newPassword)
      throw new appError(ErrorMessage.SAME_PASSWORD, ErrorCode.ALREADY_EXIST);
    const newDoc = { password: await helper.generateHash(newPassword) };
    const updatedData = await services.updateUser(checkUser._id, newDoc);
    if (!updatedData)
      throw new appError(
        ErrorMessage.PASS_NOT_CHANGE,
        ErrorCode.SOMETHING_WRONG
      );
    commonResponse(
      res,
      SuccessCode.SUCCESS,
      updatedData,
      SuccessMessage.RECORD_UPDATED
    );
  }),

  resendOtp: catchAsync(async (req, res) => {
    const validationSchema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error, value: validatedBody } = validationSchema.validate(req.body);
    if (error)
      throw new appError(error.details[0].message, ErrorCode.BAD_REQUEST);

    const { email } = validatedBody;
    const filter = { email: email };
    const dataFound = await services.findOneUser(filter);
    const storedOTP = await services.findOTP({ email });

    if (!dataFound)
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);

    const createOTP = helper.generateOTP();
    const hashedOTP = await helper.generateHash(createOTP.otp);

    if (storedOTP) {
      const data = {
        otp: hashedOTP,
        expiryTime: createOTP.expiryTime,
        isExpired: false,
      };
      await services.updateOTP(email, data);
    } else {
      await services.createOTP({
        email: email,
        otp: hashedOTP,
        expiryTime: createOTP.expiryTime,
      });
    }

    commonResponse(res, SuccessCode.SUCCESS, {}, SuccessMessage.RESEND_OTP);
  }),
};

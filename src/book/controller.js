const catchAsync = require("../utils/errorHandlers/catchAsync");
const appError = require("../utils/errorHandlers/errorHandler");
const {
  ErrorMessage,
  SuccessMessage,
} = require("../utils/commonMessages/message");
const {
  ErrorCode,
  SuccessCode,
} = require("../utils/commonStatusCode/statusCode");
const { commonResponse } = require("../utils/commonResponses/responses");
const bookService = require("../book/service");
const { insertBook, findBook, findOneBook, deleteBook } = bookService;
const userService = require("../user/service");
const { findOneUser } = userService;
const Joi = require("joi");

module.exports = {
  addNewBook: catchAsync(async function (req, res) {
    const validationSchema = Joi.object({
      name: Joi.string().required(),
      title: Joi.string().required(),
      author: Joi.string().required(),
      publicationYear: Joi.number().required(),
    });

    const { error } = validationSchema.validate(req.body);
    if (error) {
      throw new appError(error.details[0].message, ErrorCode.BAD_REQUEST);
    }

    const data = req.body;
    let userCheck = await findOneUser({ _id: req.user.userId });
    if (!userCheck)
      throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
    const doc = {
      userId: userCheck._id,
      name: data?.name,
      title: data?.title,
      author: data?.author,
      publicationYear: data?.publicationYear,
    };
    const result = await insertBook(doc);
    commonResponse(
      res,
      SuccessCode.SUCCESS,
      result,
      SuccessMessage.RECORD_CREATED
    );
  }),

  getBookList: catchAsync(async function (req, res) {
    const { author, publicationYear, page, limit } = req.query;
    const filter = {};
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    if (author) filter.author = author;
    if (publicationYear) filter.publicationYear = publicationYear;
    const result = await findBook(filter, pageNumber, limitNumber);
    if (result.length === 0)
      throw new appError(ErrorMessage.RECORD_NOT_FOUND, ErrorCode.NOT_FOUND);
    commonResponse(
      res,
      SuccessCode.SUCCESS,
      result,
      SuccessMessage.RECORD_FOUND
    );
  }),

  getSingleBookDetails: catchAsync(async function (req, res) {
    let { book_id } = req.query;
    let response = await findOneBook({ _id: book_id });
    if (!response)
      throw new appError(ErrorMessage.RECORD_NOT_FOUND, ErrorCode.NOT_FOUND);
    commonResponse(
      res,
      SuccessCode.SUCCESS,
      response,
      SuccessMessage.RECORD_CREATED
    );
  }),

  deleteBookData: catchAsync(async function (req, res) {
    const bookId = req.query.book_id;
    const getBookData = await findOneBook({ _id: bookId });
    if (!getBookData) {
      throw new appError(ErrorMessage.RECORD_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    const deletedBook = await deleteBook(bookId);
    if (!deletedBook) {
      throw new appError(ErrorMessage.RECORD_NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    commonResponse(
      res,
      SuccessCode.SUCCESS,
      true,
      SuccessMessage.RECORD_DELETED
    );
  }),
};

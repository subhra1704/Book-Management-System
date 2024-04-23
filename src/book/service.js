const bookModel = require("./model.js");

module.exports = {
  insertBook: async (doc) => {
    const dbResponse = await bookModel.create(doc);
    return dbResponse;
  },


  findBook: async (filter = {}, page = 1, limit = 10, projection = {}) => {
    const { userId, ...searchFilter } = filter;
    const query = {};
    if (searchFilter.author) {
      query.author = { $regex: searchFilter.author, $options: "i" };
    }
    if (searchFilter.publicationYear) {
      query.publicationYear = searchFilter.publicationYear;
    }

    const dbResponse = await bookModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(projection)
      .populate("userId");
    return dbResponse;
  },

  findOneBook: async (filter = {}, projection = {}) => {
    const dbResponse = await bookModel
      .findOne(filter, projection)
      .populate("userId");
    return dbResponse;
  },


  deleteBook: async (filter = {}) => {
    const deletedBook = await bookModel.findOneAndDelete(filter);
    return deletedBook;
  },
};

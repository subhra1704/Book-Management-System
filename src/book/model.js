const mongoose = require("mongoose");
const schema = mongoose.Schema;
const status = require("../utils/enum/status");

const bookModel = new schema(
  {
    userId: { type: schema.Types.ObjectId, ref: "users" },
    name: { type: String },
    title: { type: String },
    author: { type: String },
    publicationYear: { type: Number },
    status: {
      type: String,
      enum: [status.ACTIVE, status.INACTIVE],
      default: status.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("books", bookModel);

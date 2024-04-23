const express = require("express");
const routes = express.Router();
const book = require("./controller");
const { authorize } = require("../middleware/auth");

routes.get("/", book.getBookList);
routes.get("/:id", book.getSingleBookDetails);
routes.post("/", authorize, book.addNewBook);
routes.delete("/",book.deleteBookData)


module.exports = routes;

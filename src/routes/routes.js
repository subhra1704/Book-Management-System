const router = require("express").Router();
const user = require("../user/routes");
const book=require("../book/routes");

router.use("/user", user);
router.use("/book",book)

module.exports = router;

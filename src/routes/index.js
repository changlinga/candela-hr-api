const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/publicKey", require("./publicKey"));

module.exports = router;

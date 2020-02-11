const router = require("express").Router();

/**
 * POST /users/login
 * REST API to login using staffId & password
 */
router.post("/login", async (req, res) => {
  console.log("test");
  res.send(204);
});

module.exports = router;

const router = require("express").Router();
const path = require("path");
const fs = require("fs");

/**
 * GET /publicKey
 * REST API to get public key
 */
router.get("", (req, res) => {
  const PUBLIC_KEY_PATH = path.join(
    __dirname,
    "../../keys",
    process.env.PUBLIC_KEY_FILE_NAME
  );
  const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");
  res.status(200).send({
    publicKey
  });
});

module.exports = router;

const router = require("express").Router();
const _ = require("lodash");

const { UserSearchFilter } = require("../entity/searchFilter");
const { UserService, AccesstokenService } = require("../services");
const { decryptBase64withPrivateKey } = require("../utils/data_encryption");
const { compareHashedPassword } = require("../utils/password_bcrypt_service");

/**
 * POST /users/login
 * REST API to login using staffId & password
 */
router.post("/login", async (req, res) => {
  try {
    // Get data from request
    const params = _.pick(req.body, ["staffId", "password"]);

    // Check if empty
    if (!params.staffId || !params.password) {
      throw new Error("Staff ID or password is incorrect.");
    }

    // Decrypt data
    const decryptedStaffId = decryptBase64withPrivateKey(params.staffId);
    const decryptedPassword = decryptBase64withPrivateKey(params.password);

    let userSearchFilter = new UserSearchFilter();
    userSearchFilter.staffId = decryptedStaffId;
    let user = await UserService.getUser(userSearchFilter);

    if (!user) {
      throw new Error("Staff ID or password is incorrect.");
    }

    // Validate user password
    if (compareHashedPassword(decryptedPassword, user.password) === true) {
      let accesstoken = await AccesstokenService.createUserAccesstoken(
        req,
        user
      );
      res.status(200).send({
        user: {
          ...user.toJSON(),
          accesstoken: accesstoken.token
        }
      });
    } else {
      throw new Error("Staff ID or password is incorrect.");
    }
  } catch (error) {
    res.status(401).send({
      errorMessage:
        error && error.message ? error.message : "Something went wrong..."
    });
  }
});

module.exports = router;

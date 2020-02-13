const router = require("express").Router();
const _ = require("lodash");

const { UserSearchFilter } = require("../entity/searchFilter");
const { UserService, AccesstokenService } = require("../services");
const { decryptBase64withPrivateKey } = require("../utils/data_encryption");
const { compareHashedPassword } = require("../utils/password_bcrypt_service");
const Response = require("../utils/response");
const { UnauthorizedError } = require("../utils/error");
const { authenticate } = require("../middleware/authenticate");

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
      throw new UnauthorizedError("Staff ID or password is incorrect.");
    }

    // Decrypt data
    const decryptedStaffId = decryptBase64withPrivateKey(params.staffId);
    const decryptedPassword = decryptBase64withPrivateKey(params.password);

    let userSearchFilter = new UserSearchFilter();
    userSearchFilter.staffId = decryptedStaffId;
    let user = await UserService.getUser(userSearchFilter);

    if (!user) {
      throw new UnauthorizedError("Staff ID or password is incorrect.");
    }

    // Validate user password
    if (compareHashedPassword(decryptedPassword, user.password) === true) {
      let accesstoken = await AccesstokenService.createUserAccesstoken(
        req,
        user
      );
      Response.success(res, {
        user: {
          ...user.toJSON(),
          accesstoken: accesstoken.token
        }
      });
    } else {
      throw new UnauthorizedError("Staff ID or password is incorrect.");
    }
  } catch (error) {
    Response.error(res, error);
  }
});

/**
 * GET /users
 * REST API to get list of users
 */
router.get("", authenticate, async (req, res) => {
  try {
    let userSearchFilter = new UserSearchFilter();
    if (req.query.query) {
      userSearchFilter.name = req.query.query;
    }
    let users = await UserService.getAllUser(userSearchFilter);

    Response.success(res, {
      users
    });
  } catch (error) {
    Response.error(res, error);
  }
});

module.exports = router;

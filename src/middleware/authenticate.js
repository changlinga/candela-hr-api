const moment = require("moment");
const Response = require("../utils/response");
const {
  UnauthorizedError,
  ForbiddenError,
  TimeoutError
} = require("../utils/error");

const {
  AccesstokenSearchFilter,
  UserSearchFilter,
  DepartmentSearchFilter
} = require("../entity/searchFilter");
const {
  AccesstokenService,
  UserService,
  DepartmentService
} = require("../services");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Accesstoken");

    if (!token) {
      throw new UnauthorizedError("Authentication Failed.");
    }

    // Get accesstoken object
    let accesstokenSearchFilter = new AccesstokenSearchFilter();
    accesstokenSearchFilter.token = token;
    let accesstoken = await AccesstokenService.getAccesstoken(
      accesstokenSearchFilter
    );

    // Get HR department
    let departmentSearchFilter = new DepartmentSearchFilter();
    departmentSearchFilter.code = process.env.HR_DEPARTMENT_CODE;
    let department = await DepartmentService.getDepartment(
      departmentSearchFilter
    );

    if (!accesstoken || !department) {
      throw new UnauthorizedError("Authentication Failed.");
    }

    // Get user based on accesstoken userId
    let userSearchFilter = new UserSearchFilter();
    userSearchFilter._id = accesstoken.userId;
    let user = await UserService.getUser(userSearchFilter);

    if (!user) {
      throw new UnauthorizedError("Authentication Failed.");
    }

    // Throw error if user is not under HR department
    if (user.departmentId !== department._id.toString()) {
      throw new ForbiddenError("You must be an HR.");
    }

    const now = moment().valueOf();

    // Throw error if user's start date has not reached
    if (user.startDate && moment(user.startDate).valueOf() > now) {
      throw new ForbiddenError("You have not started working in this company.");
    }

    // Throw error if user is being terminated
    if (user.terminationDate && moment(user.terminationDate).valueOf() <= now) {
      throw new ForbiddenError("You are no longer working in this company.");
    }

    // Check if token has expired
    if (moment(accesstoken.expiresAt).valueOf() <= now) {
      throw new TimeoutError("Your session has expired.");
    } else {
      // Extend accesstoken expire time
      accesstoken = await AccesstokenService.editAccessToken(accesstoken._id, {
        expiresAt: moment()
          .add(1, "day")
          .toDate()
      });
    }

    req.user = user;
    req.tokenId = accesstoken._id;

    next();
  } catch (error) {
    Response.error(res, error);
  }
};

module.exports = {
  authenticate
};

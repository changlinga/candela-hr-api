const moment = require("moment");
const jwt = require("jsonwebtoken");
const { Accesstoken } = require("../models");
const AccesstokenSearchFilter = require("../entity/searchFilter/AccesstokenSearchFilter");

class AccesstokenService {
  constructor() {
    this.db = Accesstoken;
  }

  async getAllAccesstoken(searchFilter = new AccesstokenSearchFilter()) {
    try {
      // Define search filter
      let params = {};

      // check filter _id
      if (searchFilter._id) params._id = searchFilter._id;

      // check filter token
      if (searchFilter.token) params.token = searchFilter.token;

      // check filter userId
      if (searchFilter.userId) params.userId = searchFilter.userId;

      // Get result
      let result = await this.db.find(params);

      // Limit result
      if (searchFilter.searchMax) {
        result = result.max(searchFilter.searchMax);
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAccesstoken(searchFilter = new AccesstokenSearchFilter()) {
    try {
      searchFilter.searchMax = 1;
      let result = await this.getAllAccesstoken(searchFilter);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async createUserAccesstoken(request, user) {
    try {
      if (!user) throw new Error("user is missing");

      const tokenData = {
        token: jwt
          .sign({ id: user._id, tokenType: "auth" }, process.env.JWT_SECRET)
          .toString(),
        expiresAt: moment()
          .add(1, "day")
          .toDate(),
        userId: user._id,
        accessFromIP: request.ip,
        userAgent: request.get("User-Agent") || "Cannot be identified"
      };

      const newAccesstoken = new Accesstoken(tokenData);
      let result = await newAccesstoken.save();
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AccesstokenService();

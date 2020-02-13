const moment = require("moment");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { Accesstoken } = require("../models");
const AccesstokenSearchFilter = require("../entity/searchFilter/AccesstokenSearchFilter");

const ObjectId = mongoose.Types.ObjectId;

class AccesstokenService {
  constructor() {
    this.db = Accesstoken;
  }

  async getAllAccesstoken(searchFilter = new AccesstokenSearchFilter()) {
    try {
      // Define search filter
      let params = {};

      // check filter _id
      if (searchFilter._id) params._id = new ObjectId(searchFilter._id);

      // check filter token
      if (searchFilter.token) params.token = searchFilter.token;

      // check filter userId
      if (searchFilter.userId) params.userId = searchFilter.userId;

      // Get result
      let result = await this.db.find(params);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAccesstoken(searchFilter = new AccesstokenSearchFilter()) {
    try {
      let result = await this.getAllAccesstoken(searchFilter);
      return result.length > 0 ? result[0] : null;
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

  async editAccessToken(_id, updatedData) {
    try {
      if (!ObjectId.isValid(_id)) throw new Error("_id is missing");
      if (!updatedData) throw new Error("updated data is missing");

      // Prepare updated data
      let queryData = { $set: updatedData };

      // Prepare query
      let queryParam = { _id: new ObjectId(_id) };
      let queryOption = { new: true };

      let result = await this.db.findOneAndUpdate(
        queryParam,
        queryData,
        queryOption
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AccesstokenService();

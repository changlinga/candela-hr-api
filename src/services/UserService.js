const { User } = require("../models");
const { UserSearchFilter } = require("../entity/searchFilter");

class UserService {
  constructor() {
    this.db = User;
  }

  async getAllUser(searchFilter = new UserSearchFilter()) {
    try {
      // Check search filter
      let params = {};

      // filter by id
      if (searchFilter._id) params._id = new ObjectId(searchFilter._id);

      // filter by staffid
      if (searchFilter.staffId)
        params.staffId = searchFilter.staffId.toLowerCase();

      // filter by name
      if (searchFilter.name)
        params.name = { $regex: searchFilter.name, $options: "i" };

      // pagination
      let max = parseInt(searchFilter.searchMax);
      let page = parseInt(searchFilter.searchPage) - 1;
      let skip = page * max;

      // Get result
      let result = await this.db
        .find(params)
        .skip(skip)
        .limit(max);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getUser(searchFilter = new UserSearchFilter()) {
    try {
      // Validate search filter (ensure it has something to find)
      if (!searchFilter._id && !searchFilter.staffId && !searchFilter.name) {
        throw new Error("UserSearchFilter does not contain data to find");
      }

      searchFilter.searchMax = 1;
      searchFilter.searchPage = 1;
      let result = await this.getAllUser(searchFilter);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserService();

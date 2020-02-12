const { User } = require("../models");
const {
  UserSearchFilter,
  DepartmentSearchFilter
} = require("../entity/searchFilter");
const DepartmentService = require("../services/DepartmentService");
const { USER_GENDER } = require("../entity/constant/user");
const { getHashedPassword } = require("../utils/password_bcrypt_service");

class UserService {
  constructor() {
    this.db = User;
  }

  /**
   * Create data if not exist
   */
  async initialize() {
    try {
      // Get HR department id
      let departmentSearchFilter = new DepartmentSearchFilter();
      departmentSearchFilter.code = process.env.HR_DEPARTMENT_CODE;
      let department = await DepartmentService.getDepartment(
        departmentSearchFilter
      );

      if (department) {
        // Create first user from HR department
        await this.create({
          staffId: "0001",
          name: "Demo HR",
          birthDate: new Date(1980, 0, 1),
          gender: USER_GENDER.MALE,
          contactNo: "81234567",
          contactNoCountryCode: "+65",
          email: "test@gmail.com",
          departmentId: department._id.toString(),
          designation: "HR Manager",
          startDate: new Date(2018, 0, 1),
          password: getHashedPassword("Password1")
        });
      }
    } catch (err) {
      console.error(
        "Unable to create user from HR department to User db, probably data already exist"
      );
    }
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
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      throw err;
    }
  }

  async create(userModel) {
    try {
      // Validation
      if (!userModel) throw new Error("userModel is missing");

      // Create user
      let user = new User(userModel);
      let result = await user.save();
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserService();

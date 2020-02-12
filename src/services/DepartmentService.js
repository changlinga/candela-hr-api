const { Department } = require("../models");

class DepartmentService {
  constructor() {
    this.db = Department;
  }

  /**
   * Create data if not exist
   */
  async initialize() {
    // Create HR department
    try {
      await this.create({
        code: process.env.HR_DEPARTMENT_CODE,
        name: "Human Resource"
      });
    } catch (err) {
      console.error(
        "Unable to create 'HR' to Department db, probably data already exist"
      );
    }
  }

  async getAllDepartment(searchFilter = new DepartmentSearchFilter()) {
    try {
      // Check search filter
      let params = {};

      // filter by id
      if (searchFilter._id) params._id = new ObjectId(searchFilter._id);

      // filter by code
      if (searchFilter.code) params.code = searchFilter.code.toLowerCase();

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

  async getDepartment(searchFilter = new DepartmentSearchFilter()) {
    try {
      // Validate search filter (ensure it has something to find)
      if (!searchFilter._id && !searchFilter.code) {
        throw new Error("DepartmentSearchFilter does not contain data to find");
      }

      searchFilter.searchMax = 1;
      searchFilter.searchPage = 1;
      let result = await this.getAllDepartment(searchFilter);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      throw err;
    }
  }

  async create(departmentModel) {
    try {
      // Validation
      if (!departmentModel) throw new Error("departmentModel is missing");

      // Create department
      let department = new Department(departmentModel);
      let result = await department.save();
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new DepartmentService();

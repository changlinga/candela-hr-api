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
        code: "HR",
        name: "Human Resource"
      });
    } catch (err) {
      console.error(
        "Unable to create 'HR' to Department db, probably data already exist"
      );
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

class BaseService {
  constructor(model) {
    if (!model) {
      throw new Error("Model is required");
    }

    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      return { error: false, data: result, message: "Successfully created" };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Failed to create, try again later",
      };
    }
  }

  async find(filter) {
    try {
      const result = await this.model.find(filter);
      return { error: false, data: result };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Error, Please try again later.",
      };
    }
  }

  async update(id, data) {
    try {
      if (!id || !data) {
        return {
          error: true,
          message: "ID and data are required",
        };
      }

      const result = await this.model.findByIdAndUpdate(id, data);
      return { error: false, data: result, message: "Successfully updated" };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Failed to update, try again later",
      };
    }
  }

  async remove(id) {
    try {
      if (!id) {
        return {
          error: true,
          message: "ID is required",
        };
      }

      const result = await this.model.findByIdAndDelete(id);
      return { error: false, data: result, message: "Successfully removed" };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Failed to remove, try again later",
      };
    }
  }
}

module.exports = BaseService;

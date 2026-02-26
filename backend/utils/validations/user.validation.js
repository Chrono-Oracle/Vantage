const z = require("zod");

const userValidation = (req, res, next) => {
  try {
    const schema = z.object({
      fullName: z
        .string()
        .min(4, "Full name must be at least 4 characters")
        .max(50, "Full name must be less than 50 characters")
        .trim(),
      email: z
        .string()
        .min(4, "Email must be at least 4 characters")
        .max(50, "Email must be less than 50 characters")
        .email("Invalid email format")
        .trim(),
      phone: z
        .string()
        .min(8, "Phone number must be at least 8 characters")
        .max(20, "Phone number must be less than 20 characters")
        .trim(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be less than 50 characters")
        .trim(),
      status: z.enum(["active", "inactive"]).default("active"),
      role: z.enum(["admin", "user"]).default("user"),
    });
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = JSON.parse(err.message);
      return res.status(400).json({
        path: errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
        message:
          "Validation error, please check the input fields and try again.",
      });
    }
  }
};

module.exports = {
  userValidation,
};

const { z } = require("zod");
const Validation = require('./index')

const userValidation = (req, res, next) => {

  const schema = z.object({
    fullName: z.string().min(4).max(50).trim(),
    email: z.string().email().trim().toLowerCase(),
    phone: z.string().min(8).max(15).trim(),
    dob: z.coerce.date().refine(data => {
        const today = new Date();
        const age = today.getFullYear() - data.getFullYear();
        return age >= 18;
    }, "Legal betting age is 18+"),
    password: z.string().min(8, "Invalid password").max(50),
    status: z.enum(["active", "inactive"]).optional().default("active"),
    role: z.enum(["admin", "user"]).optional().default("user"),
  })

  const valid = Validation(schema, req.body);
  if (valid.isValid) {
    req.body = valid.data;
    next()
  } else {
    return res.status(400).json(valid.error);
  }

};


module.exports = { userValidation }
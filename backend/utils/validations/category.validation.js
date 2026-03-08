const { z } = require("zod");
const Validation = require("./index");

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

const categoryValidation = (req, res, next) => {
  const schema = z.object({
    name: z.string().min(5).max(50).trim(),
    slug: z.string().min(3).max(60).trim().toLowerCase(),
    sport: objectIdSchema, // Sport ObjectId
    logo: z.string().url().optional().or(z.literal("")).nullable().default(""),
    priority: z.number().int().min(0).optional().default(0),
  });

  const valid = Validation(schema, req.body);

  if (valid.isValid) {
    req.body = valid.data;
    return next();
  } else {
    return res.status(400).json(valid.error);
  }
};

module.exports = { categoryValidation };

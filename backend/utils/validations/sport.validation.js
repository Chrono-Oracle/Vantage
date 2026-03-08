const { z } = require("zod");
const Validation = require("./index");

const sportValidation = (req, res, next) => {
  const schema = z.object({
    name: z.string().min(3).max(50).trim(),
    slug: z.string().min(3).max(50).trim().toLowerCase(),
    logo: z.string().url().optional().or(z.literal("")).nullable().default(null),
    isActive: z.boolean().optional().default(true),
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

module.exports = { sportValidation };

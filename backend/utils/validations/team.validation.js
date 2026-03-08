const { z } = require("zod");
const Validation = require("./index");

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

const teamValidation = (req, res, next) => {
  const schema = z.object({
    name: z.string().min(2).max(100).trim(),
    shortName: z.string().min(2).max(30).trim().optional().default(""),
    code: z.string().min(2).max(10).trim().optional().default(""),

    logo: z.string().url().optional().or(z.literal("")).nullable().default(null),

    sport: objectIdSchema, // Sport ObjectId
    league: objectIdSchema.optional().nullable().default(null), // League ObjectId

    country: z.string().min(2).max(60).trim().optional().default(""),
    city: z.string().min(2).max(60).trim().optional().default(""),
    foundedYear: z.number().int().min(1800).max(2100).optional().nullable(),
    stadiumName: z.string().min(2).max(100).trim().optional().default(""),
    isActive: z.boolean().optional().default(true),
  });

  const valid = Validation(schema, req.body);

  if (valid.isValid) {
    req.body = valid.data;
    return next();
  } else {
    return res.status(400).json(valid.error);
  }
};

module.exports = { teamValidation };

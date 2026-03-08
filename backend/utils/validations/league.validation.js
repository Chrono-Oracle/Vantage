const { z } = require("zod");
const Validation = require("./index");

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

const leagueValidation = (req, res, next) => {
  const schema = z.object({
    name: z.string().min(3).max(100).trim(),
    shortName: z.string().min(2).max(20).trim().optional().default(""),
    sport: objectIdSchema, // Sport ObjectId
    logo: z.string().url().optional().or(z.literal("")).nullable().default(null),
    country: z.string().min(2).max(60).trim().optional().default(""),
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

module.exports = { leagueValidation };

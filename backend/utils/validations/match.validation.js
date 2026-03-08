const { z } = require("zod");
const Validation = require("./index");

// helper for Mongo ObjectId as string
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

const matchValidation = (req, res, next) => {
  const schema = z.object({
    // references
    sport: objectIdSchema,
    league: objectIdSchema,
    teamA: objectIdSchema,
    teamB: objectIdSchema,
    category: objectIdSchema,

    // time info
    time: z.string().min(4).max(50).trim(),
    startTime: z.coerce.date(),

    // odds
    odds: z
      .object({
        home: z.number().min(1).default(1),
        away: z.number().min(1).default(1),
        draw: z.number().min(1).default(1),
      })
      .optional()
      .default({ home: 1, away: 1, draw: 1 }),

    // score (usually 0 on creation)
    score: z
      .object({
        home: z.number().min(0).default(0),
        away: z.number().min(0).default(0),
      })
      .optional()
      .default({ home: 0, away: 0 }),

    // result (mostly null when creating)
    result: z
      .enum(["A", "B", "X", "void"])
      .nullable()
      .optional()
      .default(null),

    // status for tabs: upcoming / ongoing / finished
    status: z
      .enum(["upcoming", "ongoing", "finished"])
      .optional()
      .default("upcoming"),

    // live minute for live games
    liveMinute: z.number().int().min(0).optional().default(0),
  });

  const valid = Validation(schema, req.body);

  if (valid.isValid) {
    req.body = valid.data;
    return next();
  } else {
    return res.status(400).json(valid.error);
  }
};

module.exports = { matchValidation };

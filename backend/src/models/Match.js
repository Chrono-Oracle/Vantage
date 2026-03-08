const { Schema, model } = require("mongoose");

const matchSchema = new Schema(
  {
    // Relations
    sport: {
      type: Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
      index: true,
    },
    league: {
      type: Schema.Types.ObjectId,
      ref: "League",
      required: true,
      index: true,
    },

    // Teams
    teamA: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    teamB: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    // Time info
    time: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    // Betting odds
    odds: {
      home: { type: Number, default: 1 },
      away: { type: Number, default: 1 },
      draw: { type: Number, default: 1 },
    },

    // Score
    score: {
      home: { type: Number, default: 0 },
      away: { type: Number, default: 0 },
    },

    // Result (A = home, B = away, X = draw, void)
    result: {
      type: String,
      enum: ["A", "B", "X", "void"],
      default: null,
    },

    // Category (e.g. "featured", "popular", etc.)
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Match status for filtering tabs
    status: {
      type: String,
      required: true,
      enum: ["upcoming", "ongoing", "finished"],
      default: "upcoming",
    },

    // For live games
    liveMinute: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Unique match per sport + league + teams + startTime
matchSchema.index(
  { sport: 1, league: 1, teamA: 1, teamB: 1, startTime: 1 },
  { unique: true },
);

const Match = model("Match", matchSchema);

module.exports = Match;

const { Schema, model } = require("mongoose");

const matchSchema = new Schema(
  {
    sport: {
      type: String,
      required: true,
      enum: [
        "football",
        "basketball",
        "tennis",
        "baseball",
        "hockey",
        "volleyball",
        "racing",
        "boxing",
      ],
      lowercase: true,
      index: true,
    },
    time: {
      type: String,
      required: true,
      min: 4,
      max: 50,
      trim: true,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    teamA: { name: String, logo: String }, // Grouping name and logo
    teamB: { name: String, logo: String },

    odds: {
      home: { type: Number, default: 1 },
      away: { type: Number, default: 1 },
      draw: { type: Number, default: 1 },
    },

    score: {
      home: { type: Number, default: 0 },
      away: { type: Number, default: 0 },
    },

    result: {
      type: String,
      enum: ["A", "B", "X", "void"],
      default: null,
    },
    leagueInfo: {
      name: { type: String, required: true },
      country: { type: String },
      logo: { type: String },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["upcoming", "ongoing", "finished"],
      default: "upcoming",
    },
    liveMinute: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Match = model("matches", matchSchema);

module.exports = Match;

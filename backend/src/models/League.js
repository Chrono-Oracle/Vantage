const { Schema, model } = require("mongoose");

const leagueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // e.g. "Premier League"
    },
    shortName: {
      type: String,
      trim: true, // e.g. "EPL"
    },
    sport: {
      type: Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },
    logo: {
      type: String, // logo for the league if you want
      default: null,
    },
    country: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const League = model("League", leagueSchema);

module.exports = League;

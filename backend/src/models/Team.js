const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      trim: true, // e.g. "MAN UTD"
    },
    code: {
      type: String,
      trim: true, // e.g. "MUN"
    },
    logo: {
      type: String, // URL or path to image
      default: null,
    },

    // Relationships
    sport: {
      type: Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },
    league: {
      type: Schema.Types.ObjectId,
      ref: "League",
      required: false, // can be optional if you want teams not tied yet
    },

    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },

    // For later stats / metadata
    foundedYear: Number,
    stadiumName: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Unique combination: name + league
teamSchema.index(
  { name: 1, league: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } },
);

const Team = model("Team", teamSchema);

module.exports = Team;

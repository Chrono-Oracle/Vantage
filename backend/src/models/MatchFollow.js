const { Schema, model } = require("mongoose");

const matchFollowSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    match: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
  },
  { timestamps: true }
);

// Unique index prevents a user from following the same match twice
matchFollowSchema.index({ user: 1, match: 1 }, { unique: true });
// Index on match for fast lookup of "Who else is following this match"
matchFollowSchema.index({ match: 1 });

const MatchFollow = model("MatchFollow", matchFollowSchema);
module.exports = MatchFollow;
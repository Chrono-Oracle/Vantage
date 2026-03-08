const { Schema, model } = require("mongoose");

const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure one pair per relationship
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = model("Follow", followSchema);

module.exports = Follow;

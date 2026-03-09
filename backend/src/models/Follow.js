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

// 1. Keeps relationships unique (prevents double following)
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// 2. Optimizes the "Get my followers count" query
followSchema.index({ following: 1 }); 

const Follow = model("Follow", followSchema);
module.exports = Follow;
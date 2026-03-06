const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 4,
      max: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: { type: String, required: true },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      min: 8,
      max: 50,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "active",
    },
    wallet: {
      balance: { type: Number, default: 0, min: 0 },
      currency: { type: String, default: "XAF" },
    },
    bonusBalance: {
      type: Number,
      default: 0,
    },
    totalBetsPlaced: {
      type: Number,
      default: 0,
    },
    bets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bet",
      },
    ],
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

const User = model("User", userSchema);

module.exports = User;

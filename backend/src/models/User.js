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
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      min: 8,
      max: 200,
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

    //Gamification
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    experiencePoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    rankTitle: {
      type: String,
      default: "Amateur",
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

    //favorites
    favoriteSport: {
      type: Schema.Types.ObjectId,
      ref: "Sport",
      default: null,
    },
    favoriteClub: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    lastLogin: { type: Date },
  },
  { timestamps: true },
);


const User = model("User", userSchema);

module.exports = User;

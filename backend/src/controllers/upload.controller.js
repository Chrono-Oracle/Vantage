// controllers/upload.controller.js
const path = require("node:path");

// Import all models you want to support
const User = require("../models/User");
const Sport = require("../models/Sport");
const League = require("../models/League");
const Team = require("../models/Team");
// add others as needed

// Map model keys from the client to actual models
const modelMap = {
  user: User,
  sport: Sport,
  league: League,
  team: Team,
};

const uploadImage = async (req, res) => {
  try {
    // file from multer
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No file uploaded",
      });
    }

    const { id, model, field } = req.body;

    if (!id || !model || !field) {
      return res.status(422).json({
        error: true,
        message: "id, model and field are required",
      });
    }

    const Model = modelMap[model];
    if (!Model) {
      return res.status(400).json({
        error: true,
        message: "Invalid model type",
      });
    }

    const doc = await Model.findById(id);
    if (!doc) {
      return res.status(404).json({
        error: true,
        message: "Document not found",
      });
    }

    const relativePath = path.posix.join("uploads", req.file.filename);

    // set the field dynamically, e.g. doc.logo or doc.avatar
    doc[field] = relativePath;
    await doc.save();

    return res.json({
      error: false,
      message: "Image uploaded successfully",
      data: {
        id: doc._id,
        [field]: doc[field],
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error, please retry later",
    });
  }
};

module.exports = { uploadImage };

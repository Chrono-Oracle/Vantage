require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connect } = require("./configs/database.config");
const sportRoute = require("./routes/sport.route");
const userRoute = require("./routes/user.route");
const matchRoute = require("./routes/match.route");
const betRoute = require("./routes/bet.route");
const categoryRoute = require("./routes/category.route");

const run = async () => {
  try {
    const PORT = process.env.PORT || 4000;
    const app = express();

    await connect();

    app.use(cors());
    app.use(express.json());

    //Import all routes
    app.use("/sport", sportRoute);
    app.use("/user", userRoute);
    app.use("/match", matchRoute);
    app.use("/bet", betRoute);
    app.use("/category", categoryRoute);

    app.listen(PORT, () => {
      console.log("Application run on http://localhost:" + PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

run();

const express = require("express");
const app = express();
var cors = require("cors");
const { SERVER_PORT } = require("./constants");

// import routes
const userRoutes = require("./routes/user.route");
const warehouseRoutes = require("./routes/warehouse.route");

// import middlewares
const { errorHandler } = require("./middlewares/error.middleware");

app.use(cors());
// initialize express middleware
app.use(express.json());

// initialize routes
app.use("/api", userRoutes);
app.use("/api", warehouseRoutes);

// error middleware
app.use(errorHandler);

// app start
const appStart = () => {
  try {
    app.listen(SERVER_PORT, () => {
      console.log(`The app is running at http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

appStart();

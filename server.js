const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

if (
  !process.env.JWT_SECRET ||
  !process.env.ADMIN_USER ||
  !process.env.ADMIN_PASS
) {
  throw new Error(
    "Missing an environment variable, please look at the docs :)"
  );
}

// Database
const sqlDb = require("./models/index");

// Sync DB
sqlDb.sequelize.sync().then(() => {
  console.log("database synced");
});

// Import route files
const auth = require("./routes/auth");
const admin = require("./routes/admin");

const PORT = process.env.PORT || 7090;
const app = express();

app.use(express.json());

// Security
app.use(helmet());

app.use(xss());

app.use(hpp());

// Cors
// TODO: ENV VARS FOR CORS
var corsOptions = {
  origin: process.env.RADIUM_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

const { userAuth } = require("./middleware/auth");

const protectOptions = {
  origin: process.env.RADIUM_URL,
};

app.use(
  "/api/v1/protect",
  userAuth,
  cors(protectOptions),
  express.static("output")
);

app.use("/", express.static("public"));

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);

const server = app.listen(
  PORT,
  console.log(
    `Protect server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
});

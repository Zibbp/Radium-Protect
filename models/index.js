const { Sequelize } = require("sequelize");
const sqlite = require("sqlite3");
var fs = require("fs");
var path = require("path");
const basename = path.basename(__filename);

// Create sqlite database if new installation
const db = new sqlite.Database("./database/database.sqlite", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("created new database");
});

// Init Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/database.sqlite",
  logging: false,
});

var sqlDb = {};

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

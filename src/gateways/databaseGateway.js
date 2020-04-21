export default function getDatabase() {
  "use strict";

  const fs = require("fs");
  const path = require("path");
  const Sequelize = require("sequelize");
  const basename = path.basename(__filename);
  const env = process.env.NODE_ENV || "development";
  const config = require(__dirname + "/../../config/config.json")[env];
  const modelsPath = __dirname + "/../../models";
  const db = {};

  let sequelize;
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
  }

  // Adds all models in root_dir/models so we can call db.ScheduledCall
  fs.readdirSync(modelsPath)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      const model = sequelize["import"](path.join(modelsPath, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
}

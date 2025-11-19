"use strict";

import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import process from "process";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const configModule = (await import("../config/config.js")).default;
const config = configModule[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  const dbUrl =
    process.env[config.use_env_variable] || process.env.DATABASE_URL;
  const expectedKey = config.use_env_variable || "DATABASE_URL";
  console.log(
    `DB config: env='${env}', using env var '${expectedKey}' -> ${
      dbUrl ? "present" : "missing"
    }`
  );
  if (!dbUrl) {
    throw new Error(
      `Environment variable ${expectedKey} is not set. Please set the ${expectedKey} environment variable for production.`
    );
  }
  // Ensure SSL options are present for production connections (Railway)
  if (env === "production") {
    config.dialectOptions = config.dialectOptions || {};
    config.dialectOptions.ssl = config.dialectOptions.ssl || {
      require: true,
      rejectUnauthorized: false,
    };
  }
  sequelize = new Sequelize(dbUrl, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.slice(-3) === ".js" &&
    file.indexOf(".test.js") === -1
  );
});

for (const file of files) {
  const modelModule = await import("file://" + path.resolve(__dirname, file));
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export const { User, Book, Review } = db;
export const sequelizeInstance = db.sequelize;
export const SequelizeLib = db.Sequelize;

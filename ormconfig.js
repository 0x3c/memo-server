const path = require("path");
const development = process.env.NODE_ENV !== "production";
const rootDir = development ? "src" : "build";
const fileSuffix = development ? "**/*.ts" : "**/*.js";

module.exports = {
  type: "sqlite",
  database: "database.sqlite3",
  synchronize: true,
  logging: true,
  entities: [path.resolve(rootDir, "entity", fileSuffix)],
  migrations: [path.resolve(rootDir, "migration", fileSuffix)],
  subscribers: [path.resolve(rootDir, "subscriber", fileSuffix)],
  cli: {
    entitiesDir: path.resolve(rootDir, "entity"),
    migrationsDir: path.resolve(rootDir, "migration"),
    subscribersDir: path.resolve(rootDir, "subscriber")
  }
};

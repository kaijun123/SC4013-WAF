import { Sequelize } from "sequelize";
const config = require("../../sql/config")

// Create sequelize instance
const env = process.env.NODE_ENV || "development"
const { database, username, password, port, host, dialect } = config[env]
export const sequelize = new Sequelize(database, username, password, { dialect, host, port })

// Connect to db
sequelize.authenticate()
  .then(() => { console.log('Connection has been established successfully.') })
  .catch((error) => { console.error('Unable to connect to the database:', error); })

const pgtools = require('pgtools');
const sqlConfig = require("../sql/config.js");
import * as dotenv from "dotenv"
dotenv.config()


  // https://www.npmjs.com/package/pgtools
  ;
(() => {
  // console.log(sqlConfig)
  const env = process.env.NODE_ENV || "development"
  const { database, username: user, password, port, host } = sqlConfig[env]
  // console.log("database:", database, "user:", user, "password:", password, "port:", port, "host:", host)
  pgtools.createdb({ user, password, port, host }, database, (err: any, res: any) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log("database created", database);
  })
})()
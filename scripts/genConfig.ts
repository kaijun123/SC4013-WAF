import config from "../src/setup"
import fs from "fs"
import * as dotenv from "dotenv"
dotenv.config()


  ;
(async () => {
  config.__configure("./config")

  const { username, password, schema, options } = config.datasources
  
  const nodeEnv = process.env.NODE_ENV || "development";
  const sqlJson = {
    [nodeEnv]: {
      username: username,
      password: password,
      database: schema,
      port: options?.port,
      host: options?.host,
      dialect: options?.dialect
    }
  }

  const stream = fs.createWriteStream("./sql/config.js");
  stream.write("// AUTO-GENERATED from scripts/genConfig.ts\n");
  stream.write("// Do not modify this file directly, update config/toml instead.\n\n");
  stream.write("module.exports = " + JSON.stringify(sqlJson, undefined, 2));

  stream.end();

  await new Promise((resolve) => stream.on("finish", resolve));
})()

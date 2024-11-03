"use strict";
require("../sql/setup");

import { QueryInterface } from "sequelize";
import { ModelUtils } from "../src/utils";


export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.transaction(async (transaction) => {

    console.log("executing migration");

    // your migration here
    await queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";", { transaction });

    console.log("creating books table");
    await queryInterface.createTable("books", {
      id: ModelUtils.primaryKey(),
      title: ModelUtils.genericString(true),
      author: ModelUtils.genericString(true),
    }, { transaction });
  })
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    // reverse the above
    queryInterface.dropTable("transactions");
  })
};

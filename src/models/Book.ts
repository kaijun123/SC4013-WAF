import { Model } from "sequelize";
import { ModelUtils } from "../utils";
import { sequelize } from "./index"
import { genUuid } from "../utils/uuid";

class Book extends Model {
  public static tableName: "books";
  public id!: string
  public title!: string
  public author!: string

  static genId(title: string, author: string) {
    return genUuid([title, author])
  }
};

Book.init({
  id: ModelUtils.primaryKey(),
  title: ModelUtils.genericString(true),
  author: ModelUtils.genericString(true),
}, { timestamps: false, tableName: "books", sequelize })

export default Book;
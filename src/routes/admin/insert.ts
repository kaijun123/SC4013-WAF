import { NextFunction, Request, Response } from "express"
import { QueryTypes } from "sequelize"
import { sequelize } from "src/models"


export const insertHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, id } = req.body
    if (!title || title === "") return res.status(400).json({ "status": "Title not provided" });
    if (!author || author === "") return res.status(400).json({ "status": "Author not provided" });

    // VULNERABLE CODE: SQL Injection
    await sequelize.query(
      `
      INSERT INTO "books" ("id", "title", "author")
      VALUES('${id}', '${title}', '${author}')
      `,
      {
        raw: true,
        type: QueryTypes.INSERT
      }
    )

    return res.status(200).json({ "status": "success" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ "status": "Internal Server Error" })
  }
}
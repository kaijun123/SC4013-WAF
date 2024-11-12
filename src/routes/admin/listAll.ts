import { NextFunction, Request, Response } from "express"
import { QueryTypes } from "sequelize"
import { sequelize } from "src/models"


export const listAllHandler = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const books = await sequelize.query(
      `SELECT * FROM "books"`,
      {
        raw: true,
        type: QueryTypes.SELECT
      }
    )
  
    return res.status(200).json({ "books": books })
  } catch (error) {
    console.error(error)
    return res.status(500).json({"status": "Internal Server Error"})
  }
}
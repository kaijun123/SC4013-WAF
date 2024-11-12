import { NextFunction, Request, Response } from "express"
import Book from "src/models/Book"


export const deleteAllHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Book.truncate()
    return res.status(200).json({ "status": "Success" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ "status": "Internal Server Error" })
  }
}
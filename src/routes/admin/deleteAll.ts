import { NextFunction, Request, Response } from "express"
import Book from "src/db/book"


export const deleteAllHandler = async (req: Request, res: Response, next: NextFunction) => {
  await Book.deleteMany({})
  return res.status(200).send("Success")
}
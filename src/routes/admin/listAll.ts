import { NextFunction, Request, Response } from "express"
import Book from "src/db/book"


export const listAllHandler = async (req: Request, res: Response, next: NextFunction) => {
  const books = await Book.find({})
  res.send({ "books": books })
}
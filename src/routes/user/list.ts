import { NextFunction, Request, Response } from "express"
import Book from "src/db/book"

// only select specific columns
export const listHandler = async (req: Request, res: Response, next: NextFunction) => {
  // const books = await Book.find({}).where("status").equals(BookStatus.Available).select("title status")
  const books = await Book.find({})
  console.log("books", books)
  res.send(books)
}
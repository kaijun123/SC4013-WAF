import { NextFunction, Request, Response } from "express"
import path from "path"
import Book from "src/db/book"

// only select specific columns
export const downloadHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body
  if (!id || id === "") {
    return res.status(400).send("Fail: id not provided")
  }

  console.log("id", id)

  const isExist = await Book.exists({ _id: id })
  if (!isExist) {
    return res.status(400).send("Fail: invalid id")
  }
  console.log("isExist", isExist)

  const __dirname = path.resolve();
  const bookPath = path.join(__dirname, "books", `${id}.pdf`)
  
  // TODO: check if the file exists

  res.status(200).sendFile(bookPath)
}
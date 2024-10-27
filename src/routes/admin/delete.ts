import { NextFunction, Request, Response } from "express"
import Book from "src/db/book"
import fs from "fs"
import { getBookPath } from "src/utils/utils"

export const deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body
  if (!id || id === "") return res.status(400).send("Fail: id not provided")

  await Book.deleteOne({ _id: id })

  await fs.unlink(getBookPath(id), (err) => {
    console.error(err)
  })

  res.status(200).send("Success")
}
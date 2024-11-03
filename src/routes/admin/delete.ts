import { NextFunction, Request, Response } from "express"
import fs from "fs"
import Book from "src/models/Book"
import { getBookPath } from "src/utils/utils"

export const deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body
  if (!id || id === "") return res.status(400).send("Fail: id not provided")

  const isExist = await Book.findOne({
    where: {
      id: id
    }
  })
  // console.log("isExist", isExist)

  if (isExist) {
    await Book.destroy({
      where: { id: id, },
    })

    // Delete book
    // await fs.unlink(getBookPath(id), (err) => {
    //   console.error(err)
    // })

    return res.status(200).send("Success")
  }
  else {
    return res.status(400).send("Book does not exist")
  }
}
import { NextFunction, Request, Response } from "express"
import Book from "src/models/Book"
import { getBookPath } from "src/utils/utils"

export const downloadHandler = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { id } = req.query
    if (!id || id === "") {
      return res.status(400).send("Fail: id not provided")
    }
    console.log("id", id)

    const isExist = await Book.findOne({ where: { id: id } })
    if (!isExist) {
      return res.status(400).send("Fail: invalid id")
    }
    console.log("isExist", isExist)

    // VULNERABLE CODE: Social Engineering + Reflected XSS
    // The victim can be made to download malicious code that was uploaded to the server
    const bookPath = getBookPath(id as string)

    // TODO: check if the file exists

    // Transfers the file at the given path. Sets the Content-Type response HTTP header field based on the filename’s extension.
    return res.status(200).sendFile(bookPath)
  } catch (error) {
    console.error(error)
    return res.status(200).sendFile("Internal Server Error")
  }
}
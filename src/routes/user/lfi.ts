import { NextFunction, Request, Response } from "express"

export const localFileInclusionHandler = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { path } = req.query
    if (!path || path === "") {
      return res.status(400).json({ "status": "Fail: path not provided" })
    }

    // Transfers the file at the given path. Sets the Content-Type response HTTP header field based on the filename’s extension.
    // VULNERABLE CODE: Local File Inclusion; can be made to transfer sensitive information such as keys
    return res.status(200).sendFile(path as string)
  } catch (error) {
    console.error(error)
    return res.status(200).json({ "status": "Internal Server Error" })
  }
}
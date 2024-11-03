import { NextFunction, Request, Response } from "express"

export const remoteFileInclusionHandler = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { url } = req.query
    if (!url || url === "") {
      return res.status(400).send("Fail: url not provided")
    }
    console.log("url", url)

    // Fetch external resource
    // VULNERABLE CODE: Using unvalidated URL from user input, which leads to RFI vulnerability
    const response = await fetch(url as string);
    const data = await response.json()
    console.log("data", data)
    return res.status(200).send(data);
  } catch (error) {
    console.error(error)
    return res.status(200).sendFile("Internal Server Error")
  }
}
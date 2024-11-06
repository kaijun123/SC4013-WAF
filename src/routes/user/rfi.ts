import { NextFunction, Request, Response } from "express"
import fetch from "node-fetch"

export const remoteFileInclusionHandler = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { url: url } = req.query
    console.log("url", url)
    if (!url || url === "") {
      return res.status(400).send("Fail: url not provided")
    }

    // Fetch external resource
    // VULNERABLE CODE: Using unvalidated URL from user input, which leads to RFI vulnerability
    const response = await fetch(url as string);
    // console.log("response", response.body)
    const data = await response.json()
    console.log("data", data)

    return res.status(200).send(data);
  } catch (error) {
    console.error(error)
    return res.status(200).send("Internal Server Error")
  }
}
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import Book from "src/db/book";
import { getBookPath } from "src/utils/utils";

export const uploadHandler = async (req: Request, res: Response, next: NextFunction) => {

  let uploadedFile: UploadedFile | null = null
  let book = null
  try {
    // check if file was submitted
    if (!req.files || !req.files.file) {
      return res.status(400).send('No files were uploaded');
    }

    // check if title was provided
    const title = req.body.title
    if (!title || title === "") {
      return res.status(400).send('Title not provided');
    }

    uploadedFile = req.files.file as UploadedFile

    // insert the file into the db
    book = await Book.create({
      title: title,
      // status: BookStatus.Available,
      // filename: uploadedFile.name,
      // borrower: "",
    })

    const uploadPath = getBookPath(String(book._id))
    // console.log("uploadPath", uploadPath)

    // move the book into the /books directory
    uploadedFile.mv(uploadPath, function (err) {
      if (err)
        return res.status(500).send(err);
    });

    // Return a web page showing information about the file
    res.json({
      "File-Name": `${uploadedFile.name}`,
      "File-Size": `${uploadedFile.size}`,
      "File_MD5_Hash": `${uploadedFile.md5}`,
      "File_Mime_Type": `${uploadedFile.mimetype}`
    })

  } catch (e) {
    console.error(e)
    if (uploadedFile) await fs.unlink(uploadedFile!.tempFilePath, (err) => {
      console.error(err)
    })

    if (book) await Book.deleteOne({ _id: book._id})

    res.status(500).send("Server error")
  }
}
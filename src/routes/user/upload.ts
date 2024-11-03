import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { QueryTypes } from "sequelize";
import { sequelize } from "src/models";
import Book from "src/models/Book";
import { getBookPath } from "src/utils/utils";

export const uploadHandler = async (req: Request, res: Response, next: NextFunction) => {

  let uploadedFile: UploadedFile | null = null
  let id = ""
  try {
    // check if file was submitted
    if (!req.files || !req.files.file) return res.status(400).send('No files were uploaded');

    // check if title was provided
    const { title, author } = req.body
    if (!title || title === "") return res.status(400).send('Title not provided');
    if (!author || author === "") return res.status(400).send('Author not provided');

    uploadedFile = req.files.file as UploadedFile

    id = Book.genId(title, author)

    // check if the file exists
    const isExist = await Book.findOne({ where: { id: id } })
    if (isExist) return res.status(400).send('Book already exists');

    // insert the file into the db
    // vulnerable to xss and sql injection
    await sequelize.query(`
      INSERT INTO "books" ("id", "title", "author")
      VALUES('${id}', '${title}', '${author}')
      `, {
      raw: true,
      type: QueryTypes.INSERT
    })

    const uploadPath = getBookPath(id)
    // console.log("uploadPath", uploadPath)

    // move the book into the /books directory
    uploadedFile.mv(uploadPath, function (err) {
      if (err)
        return res.status(500).send(err);
    });

    // Return a web page showing information about the file
    return res.json({
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

    if (id) await Book.destroy({ where: { id: id } })

    return res.status(500).send("Server error")
  }
}
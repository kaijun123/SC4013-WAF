import { Schema, model } from "mongoose";

// export enum BookStatus {
//   Borrowed = "borrowed",
//   Available = "available",
// }

const bookSchema = new Schema({
  title: { type: String, require: true },
  // status: { type: String, enum: BookStatus, require: true },
  // filename: { type: String, require: false },
  // borrower: { type: String, require: false }
});

const Book = model('Blog', bookSchema);
export default Book;
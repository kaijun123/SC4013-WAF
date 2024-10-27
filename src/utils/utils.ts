import path from "path";


export const getBookPath = (id: string) => {
  const __dirname = path.resolve();
  const uploadPath = path.join(__dirname, "books", `${id}.pdf`)
  return uploadPath
}

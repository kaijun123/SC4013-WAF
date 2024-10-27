import fileUpload from "express-fileupload"

export const uploadMiddleware = fileUpload({
  // Configure file uploads with maximum file size 10MB
  limits: { fileSize: 10 * 1024 * 1024 },
  // abort if the file uploaded is larger than the specified limit
  abortOnLimit: true,

  // Temporarily store uploaded files to disk, rather than buffering in memory
  useTempFiles: true,
  tempFileDir: './tmp/'
})
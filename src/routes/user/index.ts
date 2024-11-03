import { Router } from "express";
import { listHandler } from "./list";
import { downloadHandler } from "./download";
import { uploadMiddleware } from "src/middleware/file";
import { uploadHandler } from "./upload";

const router = Router()

router.get("/list", listHandler)
router.get("/download", downloadHandler)
router.post("/upload", uploadMiddleware, uploadHandler)

export default router
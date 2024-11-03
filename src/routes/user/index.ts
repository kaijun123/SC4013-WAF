import { Router } from "express";
import { uploadMiddleware } from "src/middleware/file";
import { downloadHandler } from "./download";
import { localFileInclusionHandler } from "./lfi";
import { listHandler } from "./list";
import { remoteFileInclusionHandler } from "./rfi";
import { uploadHandler } from "./upload";

const router = Router()

router.get("/list", listHandler)
router.get("/download", downloadHandler)
router.get("/lfi", localFileInclusionHandler)
router.get("/rfi", remoteFileInclusionHandler)
router.post("/upload", uploadMiddleware, uploadHandler)

export default router
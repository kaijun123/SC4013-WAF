import { Router } from "express";
import { listHandler } from "./list";
import { downloadHandler } from "./download";

const router = Router()

router.get("/list", listHandler)
router.get("/download", downloadHandler)

export default router
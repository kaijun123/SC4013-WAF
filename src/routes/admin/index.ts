import { Router } from "express";
// import { uploadMiddleware } from "src/middleware/file";
import { deleteHandler } from "./delete";
import { deleteAllHandler } from "./deleteAll";
import { listAllHandler } from "./listAll";
import { renameHandler } from "./rename";
// import { uploadHandler } from "../user/upload";

const router = Router()

// router.get("/listAll", listAllHandler)
router.delete("/delete", deleteHandler)
router.delete("/deleteAll", deleteAllHandler)
router.patch("/rename", renameHandler)
// router.post("/upload", uploadMiddleware, uploadHandler)

export default router
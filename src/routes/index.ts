import { Request, Response, Router } from "express";
import userRouter from "./user"
import adminRouter from "./admin"

const router = Router()

router.get("/healthz", (req: Request, res: Response) => {
  res.status(200).json({ "status": "success" });
});

router.use("/user", userRouter)
router.use("/admin", adminRouter)

export default router

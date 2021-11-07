import { Router } from "express";

import userRoutes from "./userRoutes";
import postRouter from "./postRoutes";

const router = new Router();

router.use("/users", userRoutes);
router.use("/posts", postRouter);

module.exports = router;

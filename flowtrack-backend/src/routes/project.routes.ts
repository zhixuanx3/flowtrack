import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as projectController from "../controllers/project.controller.js";

const router = Router({ mergeParams: true });

router.post("/", requireAuth, projectController.createProject);
router.get("/", requireAuth, projectController.getProjects);

export default router;

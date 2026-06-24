import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as organizationController from "../controllers/org.controller.js";

const router = Router();

router.post("/", requireAuth, organizationController.createOrganization);
router.get("/", requireAuth, organizationController.getOrganizations);

export default router;

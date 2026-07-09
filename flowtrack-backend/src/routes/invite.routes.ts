import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as inviteController from "../controllers/invite.controller.js";

const router = Router();

router.post("/", requireAuth, inviteController.createInvites);
router.get("/:token", inviteController.getInvite);
router.post("/:token/accept", inviteController.acceptInvite);

export default router;

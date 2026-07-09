import type { Request, Response } from "express";
import { handleError } from "../utils/error.js";
import { sendSuccess } from "../utils/response.js";
import * as inviteService from "../services/invite.service.js";
import { COOKIE_OPTIONS } from "../utils/cookies.js";

export const createInvites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const invites = await inviteService.createInvites(userId, req.body);
    sendSuccess(res, "Invites sent successfully", invites, 201);
  } catch (err) {
    handleError(err, res);
  }
};

export const getInvite = async (req: Request, res: Response) => {
  try {
    const invite = await inviteService.getInviteByToken(
      req.params.token as string,
    );
    sendSuccess(res, "Success", invite);
  } catch (err) {
    handleError(err, res);
  }
};

export const acceptInvite = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, user, org } =
      await inviteService.acceptInvite(req.params.token as string, req.body);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, "Invite accepted", { accessToken, user, org });
  } catch (err) {
    handleError(err, res, 401);
  }
};

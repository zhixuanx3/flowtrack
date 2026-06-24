import type { Request, Response } from "express";
import { handleError } from "../utils/error.js";
import { sendSuccess } from "../utils/response.js";
import * as organizationService from "../services/org.service.js";

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const organization = await organizationService.createOrganization(userId, req.body);
    sendSuccess(res, "Organization created successfully", organization, 201);
  } catch (err) {
    handleError(err, res);
  }
};

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const organizations = await organizationService.getOrganizations(userId);
    sendSuccess(res, "Success", organizations);
  } catch (err) {
    handleError(err, res);
  }
};

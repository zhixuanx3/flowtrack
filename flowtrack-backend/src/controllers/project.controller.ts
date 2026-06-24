import type { Request, Response } from "express";
import { handleError } from "../utils/error.js";
import { sendSuccess } from "../utils/response.js";
import * as projectService from "../services/project.service.js";

export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const organizationId = req.params.organizationId as string;
    const project = await projectService.createProject(userId, organizationId, req.body);
    sendSuccess(res, "Project created successfully", project, 201);
  } catch (err) {
    handleError(err, res);
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const organizationId = req.params.organizationId as string;
    const projects = await projectService.getProjects(userId, organizationId);
    sendSuccess(res, "Success", projects);
  } catch (err) {
    handleError(err, res);
  }
};

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import organizationRoutes from "./routes/org.routes.js";
import projectRoutes from "./routes/project.routes.js";
import inviteRoutes from "./routes/invite.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/organizations", organizationRoutes);
app.use("/organizations/:organizationId/projects", projectRoutes);
app.use("/invites", inviteRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;

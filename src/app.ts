import express, { Application } from "express";
import "dotenv/config";
import {
  createDeveloper,
  deleteDeveloper,
  getDeveloperById,
  updateDeveloper,
} from "./logics/developers.logics";
import {
  ensureDeveloperEmailExist,
  ensureDeveloperIdExist,
} from "./middlewares/developers.middlewares";
import { createDevInfo } from "./logics/dev_infos.logics";
import {
  ensureDevInfoExist,
  validatePreferredOS,
} from "./middlewares/dev_infos.middlewares";
import {
  createProjects,
  deleteProject,
  getProjectById,
  updateProject,
} from "./logics/projects.logics";
import {
  ensureProjectDevIdExist,
  ensureProjectIdExist,
} from "./middlewares/projects.middlewares";
import { createTechnology, deleteTechnology } from "./logics/techs.logics";
import {
  ensureNameDelete,
  ensureNameTech,
  ensureNameTechExist,
} from "./middlewares/techs.middlewares";

const app: Application = express();

app.use(express.json());

app.post("/developers", ensureDeveloperEmailExist, createDeveloper);
app.get("/developers/:id", ensureDeveloperIdExist, getDeveloperById);
app.patch(
  "/developers/:id",
  ensureDeveloperIdExist,
  ensureDeveloperEmailExist,
  updateDeveloper
);
app.delete("/developers/:id", ensureDeveloperIdExist, deleteDeveloper);
app.post(
  "/developers/:id/infos",
  ensureDeveloperIdExist,
  ensureDevInfoExist,
  validatePreferredOS,
  createDevInfo
);

app.post("/projects", ensureProjectDevIdExist, createProjects);
app.get("/projects/:id", ensureProjectIdExist, getProjectById);
app.patch(
  "/projects/:id",
  ensureProjectDevIdExist,
  ensureProjectIdExist,
  updateProject
);
app.delete("/projects/:id", ensureProjectIdExist, deleteProject);
app.post(
  "/projects/:id/technologies",
  ensureProjectIdExist,
  ensureNameTech,
  ensureNameTechExist,
  createTechnology
);
app.delete(
  "/projects/:id/technologies/:name",
  ensureProjectIdExist,
  ensureNameDelete,
  deleteTechnology
);

export default app;

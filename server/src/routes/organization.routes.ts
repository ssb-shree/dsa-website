import { Router } from "express";
import {
  addUserToOrganization,
  createOrganizationController,
  getAllEOrganizations,
  getOrganizationByID,
  removeUserToOrganization,
  updateOrganizationController,
} from "../controllers/organization.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = Router();

// create a organization
router.post("/", checkAuth, createOrganizationController);

// update information of organization
router.patch("/", checkAuth, updateOrganizationController);

// add user has member to organization
router.put("/members", checkAuth, addUserToOrganization);

//remove member from organization
router.delete("/members", checkAuth, removeUserToOrganization);

router.get("/", getAllEOrganizations);

router.get("/:slug", getOrganizationByID);

export default router;

import { Router } from "express";

const router = Router();

import {
  getAllAchivements,
  addAchivement,
  editAchivementByID,
  deleteAchivementByID,
} from "../controllers/achivement.controller";

// get all achivements
router.get("/", getAllAchivements);

// add an achivement
router.post("/", addAchivement);

// edit an achivement by id
router.put("/:id", editAchivementByID);

// delete an achivement by id
router.delete("/:id", deleteAchivementByID);

export default router;

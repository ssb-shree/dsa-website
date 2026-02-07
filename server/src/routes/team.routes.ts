import { Router } from "express";

const router = Router();

import { getAllMembers, addMember, editMemberByID, deleteMemberByID } from "../controllers/team.controller";

// get all members
router.get("/", getAllMembers);

// add a member
router.post("/", addMember);

// edit a member by id
router.put("/:ID", editMemberByID);

// delete a member by id
router.delete("/:ID", deleteMemberByID);

export default router;

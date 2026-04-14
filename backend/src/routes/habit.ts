import { Router } from "express";
import * as habitController from "../controllers/habit.controller";
import authenticate from "../middleware/authenticate";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post("/", habitController.createHabit);
router.get("/", habitController.getHabits);
router.patch("/:id", habitController.updateHabit);
router.patch("/:id/archive", habitController.archiveHabit);
router.delete("/:id", habitController.deleteHabit);

export default router;

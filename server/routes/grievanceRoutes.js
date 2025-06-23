import express from "express";
import {
  submitGrievance,
  getAllGrievances,
  getMyGrievances,
  updateGrievance,
} from "../controllers/grievanceController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", submitGrievance);
router.get("/my", authenticate, getMyGrievances);
router.get("/all", authenticate, authorize(["admin"]), getAllGrievances);
router.put("/update/:id", authenticate, authorize(["admin"]), updateGrievance);

export default router;

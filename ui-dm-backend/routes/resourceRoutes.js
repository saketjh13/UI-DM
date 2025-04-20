// routes/resourceRoutes.js
import express from "express";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getResourceSummary,
} from "../controllers/resourceController.js";

const router = express.Router();

router.get("/", getResources);
router.post("/", createResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);



router.get("/summary", getResourceSummary);


export default router;

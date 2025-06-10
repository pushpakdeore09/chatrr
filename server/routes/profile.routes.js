import { Router } from "express";
import * as authMiddleware from "../middleware/auth.middleware.js";
import * as profileController from "../controllers/profile.controller.js";

const router = Router();

router.post(
  "/v1/create-profile",
  authMiddleware.authUser,
  profileController.createProfileController
);

router.get(
  "/v1/get-profile",
  authMiddleware.authUser,
  profileController.getProfileController
);

export default router;

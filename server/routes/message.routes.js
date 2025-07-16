import Router from "express";
import * as authMiddleware from "../middleware/auth.middleware.js";
import * as messageController from "../controllers/message.controller.js";
import fileUpload from "../middleware/fileUpload.middleware.js";

const router = Router();

router.post(
  "/v1/send-message",
  authMiddleware.authUser,
  fileUpload.single("file"),
  messageController.sendMessage
);

router.get(
  "/v1/:chatId",
  authMiddleware.authUser,
  messageController.getAllMessages
);

export default router;

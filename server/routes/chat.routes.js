import Router from "express";
import * as chatController from "../controllers/chat.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/v1/get-chat",
  authMiddleware.authUser,
  chatController.getChatController
);
router.get(
  "/v1/get-chats",
  authMiddleware.authUser,
  chatController.getAllChatController
);
router.post(
  "/v1/get-or-create-chat",
  authMiddleware.authUser,
  chatController.getOrCreateChatController
);
router.get(
  "/v1/get-users-chat",
  authMiddleware.authUser,
  chatController.getChatsController
);

router.post(
  "/v1/create-group-chat",
  authMiddleware.authUser,
  chatController.createGroupChatController
);

router.put(
  "/v1/rename-group",
  authMiddleware.authUser,
  chatController.renameGroupController
);

router.put(
  "/v1/add-to-group",
  authMiddleware.authUser,
  chatController.addToGroupController
);

router.put(
  "/v1/remove-from-group",
  authMiddleware.authUser,
  chatController.removeFromGroupController
);

export default router;

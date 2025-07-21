import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

export const getAllChatController = async (req, res) => {
  const search = req.query.search;
  try {
    let query = {};

    if (search) {
      const parts = search.trim().split(" ");

      if (parts.length === 2) {
        const [first, last] = parts;
        query = {
          $and: [
            { firstName: { $regex: first, $options: "i" } },
            { lastName: { $regex: last, $options: "i" } },
          ],
        };
      } else {
        query = {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
          ],
        };
      }
    }

    const users = await User.find(query).select("-password");
    res.status(200).send(users);
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

export const getOrCreateChatController = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(500).send("Internal server error");
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstName lastName email",
  });
  if (isChat.length > 0) {
    return res.status(200).send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return res.status(200).send(fullChat);
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
};

export const getChatsController = async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName lastName email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const getChatController = async (req, res) => {
  const { chatId } = req.query;

  try {
    const chat = await Chat.findById(chatId)
      .populate("users", "firstName lastName email")
      .exec();

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const createGroupChatController = async (req, res) => {
  console.log(req.body);

  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send("Please fill all the fields");
  }
  const users = req.body.users;
  if (users.length < 2) {
    return res
      .status(400)
      .send("Please select at least 2 users to create a group chat");
  }
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);

    res.status(400).send("Failed to create group chat");
  }
};

export const renameGroupController = async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).send("Chat not found");
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (error) {
    res.status(400).send("Failed to rename group");
  }
};

export const addToGroupController = async (req, res) => {
  try {
    const { chatId, userIds } = req.body;
    console.log(userIds);
    
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: "not a array" });
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const existingUserIds = chat.users.map((userId) => userId.toString());
    const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));

    if (newUserIds.length === 0) {
      return res
        .status(400)
        .json({ message: "All users are already in the group" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { users: { $each: newUserIds } },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json({
      message: "Users added successfully",
      data: updatedChat,
    });
  } catch (error) {
    res.status(400).send("Failed to add to group");
  }
};

export const removeFromGroupController = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    try {
      const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!removed) {
        res.status(404).send("Chat not found");
      } else {
        res.status(200).json(removed);
      }
    } catch (error) {
      res.status(400).send("Failed to remoce user from group");
    }
  } catch (error) {
    res.status(400).send("Failed to remove from group");
  }
};

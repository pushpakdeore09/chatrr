import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if ((!content || content.trim() === "") && !req.file) {
    return res
      .status(400)
      .json({ message: "Either message content or file must be provided." });
  }
  if (!chatId) {
    return res.status(400).json({ message: "chatId is required." });
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  
  if (req.file) {
    newMessage.file = {
      url: req.file.path,
      public_id: req.file.filename,
      mimetype: req.file.mimetype,
    };
  }
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "firstName lastName email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstName lastName email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

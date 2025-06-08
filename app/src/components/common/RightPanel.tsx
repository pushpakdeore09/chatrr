import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { HiPaperAirplane, HiX } from "react-icons/hi";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/context/Chatcontext";
import { getChat } from "@/api/chat/Chatapi";
import { getAllMessages, sendMessage } from "@/api/message/Messageapi";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuTrigger,
} from "../ui/context-menu";

interface RightPanelProps {
  setSelectedChatId: (chatId: string | null) => void;
  selectedChatId: string | null;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  createdAt: string;
  chat: string;
}

const RightPanel: React.FC<RightPanelProps> = ({
  setSelectedChatId,
  selectedChatId,
}) => {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);
  const { chatList, setChatList } = useChat();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chat = chatList.find((chat) => chat._id === selectedChatId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [message]);

  useEffect(() => {
    if (!selectedChatId) return;

    const getChatDetails = async () => {
      try {
        const response = await getChat(selectedChatId);
        const updatedChat = response.data;

        setChatList((prevChats) => {
          const chatIndex = prevChats.findIndex(
            (chat) => chat._id === selectedChatId
          );
          if (chatIndex !== -1) {
            const updatedChats = [...prevChats];
            updatedChats[chatIndex] = updatedChat;
            return updatedChats;
          }
          return prevChats;
        });
      } catch (error) {
        console.log(error);
      }
    };
    getChatDetails();
  }, [selectedChatId, setChatList]);

  useEffect(() => {
    if (!selectedChatId) return;

    const getChatMessages = async () => {
      try {
        const response = await getAllMessages(selectedChatId);
        if (response.data) {
          console.log(response.data);
          setMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getChatMessages();
  }, [selectedChatId]);

  const otherUser = chat?.users.find(
    (user: User) => user._id !== chat?.users[0]._id
  );

  const handleSendMessage = async () => {
    const msgData = {
      content: message,
      chatId: selectedChatId,
    };

    try {
      const response = await sendMessage(msgData);
      if (response.data) setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyMessage = (msgContent: string) => {
    navigator.clipboard
      .writeText(msgContent)
      .then(() => {
        toast.success("Message copied to clipboard!");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="p-4 h-full flex flex-col">
      {chat ? (
        <div className="flex flex-col flex-grow rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b dark:border-gray-700 relative">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 border-2 rounded-full border-gray-500 dark:border-white">
                <AvatarImage />
                <AvatarFallback
                  className="flex items-center justify-center w-full h-full text-lg bg-gray-200 dark:bg-white text-gray-800 dark:text-black dark:border-white select-none cursor-pointer rounded-full"
                  onClick={() =>
                    otherUser && navigate(`/profile/${otherUser._id}`)
                  }
                >
                  {chat.isGroupChat
                    ? chat.chatName[0]
                    : otherUser?.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h2
                className="text-2xl font-bold select-none cursor-pointer"
                onClick={() => {
                  if (!chat.isGroupChat && otherUser) {
                    navigate(`/profile/${otherUser._id}`);
                  }
                }}
              >
                {chat.isGroupChat
                  ? chat.chatName
                  : otherUser
                  ? `${otherUser.firstName} ${otherUser.lastName}`
                  : "Loading..."}
              </h2>
            </div>

            <HiX
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer dark:text-white"
              size={24}
              onClick={() => setSelectedChatId(null)}
              title="Close Chat"
            />
          </div>

          {/* Messages Scrollable Area */}
         <div className="flex-grow overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex flex-col space-y-4">
              {messages.map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`flex ${msg.sender._id === user?._id ? "justify-end" : "justify-start"}`}
                  >
                    {/* Entire message container */}
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <div
                          className={`max-w-xs p-3 rounded-lg text-sm ${
                            msg.sender._id === user?._id
                              ? "bg-slate-500 text-white"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          {/* Sender's Name (only displayed if the message is not from the logged-in user) */}
                          {msg.sender._id !== user?._id && (
                            <div className="font-semibold">
                              {msg.sender.firstName} {msg.sender.lastName}
                            </div>
                          )}

                          {/* Message Content */}
                          <div>{msg.content}</div>

                          {/* Timestamp */}
                          <div className="text-xs text-white ml-8 mt-2 select-none">
                            {msg.createdAt ? format(new Date(msg.createdAt), "hh:mm a") : "Unknown Time"}
                          </div>
                        </div>
                      </ContextMenuTrigger>

                      {/* Context Menu (appears on right-click) */}
                      <ContextMenuPortal>
                        <ContextMenuContent className="p-2 bg-white shadow-md rounded-md">
                          <ContextMenuItem
                            onClick={() => handleCopyMessage(msg.content)} // Copy only the message content
                            className="cursor-pointer hover:bg-gray-100 p-2"
                          >
                            Copy Message
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenuPortal>
                    </ContextMenu>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input Bar */}
          <div className="border-t px-6 py-4 bg-white dark:bg-gray-800 flex items-center gap-3 dark:border-gray-700">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-grow resize-none overflow-hidden rounded-md px-4 py-2 leading-relaxed"
            />
            <HiPaperAirplane
              className="text-blue-500 cursor-pointer hover:text-blue-400 transform rotate-45 mb-2 text-4xl"
              onClick={handleSendMessage}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RightPanel;

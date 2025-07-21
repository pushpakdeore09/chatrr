import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { HiPaperAirplane, HiX } from "react-icons/hi";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/context/Chatcontext";
import { getChat } from "@/api/chat/Chatapi";
import {
  getAllMessages,
  sendMessage,
  checkMessage,
} from "@/api/message/Messageapi";
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
  socketConnected: any;
  socket: any;
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
  file?: {
    url: string;
    public_id: string;
    mimetype: string;
  };
}

const RightPanel: React.FC<RightPanelProps> = ({
  socket,
  socketConnected,
  setSelectedChatId,
  selectedChatId,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const { chatList, setChatList, setCurrentChatId } = useChat();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const [isTyping, setIstyping] = useState<boolean>(false);
  const chat = chatList.find((chat) => chat._id === selectedChatId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);


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

    const getChatMessages = async () => {
      try {
        const response = await getAllMessages(selectedChatId);
        if (response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (socket) {
      socket.emit("join chat", selectedChatId);
    }

    getChatDetails();
    getChatMessages();

    

    socket.on("typing", () => {
      setIstyping(true);
    });

    socket.on("stop typing", () => {
      setIstyping(false);
    });

    return () => {
      socket.off("message received");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [selectedChatId, socket, setChatList]);

  const otherUser = chat?.users.find((u: User) => u._id !== user?._id);

  const chatHeaderName = chat?.isGroupChat
    ? chat.chatName
    : otherUser
    ? `${otherUser.firstName} ${otherUser.lastName}`
    : "Loading...";
  const isValidMessage = async () => {
    const data = {
      message: message,
    };
    const response = await checkMessage(data);
    console.log(response);
    return response;
  };

  const handleProfileInfoClick = () => {
    if(chat){
      setCurrentChatId(chat._id);
    }
    if(chat?.isGroupChat){
      navigate(`/group/${chat._id}`)
    } else if(otherUser) {
      navigate(`/profile/${otherUser._id}`)
    }
  }

  const handleSendMessage = async () => {
    try {
      
        const validationResponse = await isValidMessage();
          if (validationResponse.data?.toxic) {
            toast.error(
              "Message blocked due to inappropriate language. Please edit and try again."
            );
            return;
          }
      

      socket.emit("stop typing", selectedChatId);
       
        const msgData = {
          content: message,
          chatId: selectedChatId,
        };
        const response = await sendMessage(msgData);
      

      const newMessage: Message = {
        _id: Date.now().toString(),
        sender: {
          _id: user?._id || "",
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
        },
        content: message,
        createdAt: new Date().toISOString(),
        chat: selectedChatId || "",
      };

      if (response.data) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");

        socket.emit("newMessage", response.data);
      }
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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedChatId]);

  const typeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChatId);
    }
    let lastTypingTime = new Date().getTime();
    var timer = 3000;
    setTimeout(() => {
      var currTime = new Date().getTime();
      var timeDiff = currTime - lastTypingTime;

      if (timeDiff >= timer && typing) {
        socket.emit("stop typing", selectedChatId);
        setTyping(false);
      }
    }, timer);
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
                  onClick={handleProfileInfoClick}
                >
                  {chat.isGroupChat
                    ? chat.chatName[0]
                    : otherUser?.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h2
                className="text-2xl font-bold select-none cursor-pointer"
                onClick={handleProfileInfoClick}
              >
                {chatHeaderName}
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
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    className={`flex ${
                      msg.sender._id === user?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
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
                          {msg.sender._id !== user?._id && (
                            <div className="font-semibold select-none text-xs">
                              {msg.sender.firstName} {msg.sender.lastName}
                            </div>
                          )}
                          
                            <div className="text-md">{msg.content}</div>
                          

                          <div
                            className={`text-xs ml-8 mt-2 select-none ${
                              msg.sender._id === user?._id
                                ? "text-white"
                                : "text-gray-500 dark:text-gray-700"
                            } mt-auto text-right`}
                          >
                            {msg.createdAt
                              ? format(new Date(msg.createdAt), "hh:mm a")
                              : "Unknown Time"}
                          </div>
                        </div>
                      </ContextMenuTrigger>

                      <ContextMenuPortal>
                        <ContextMenuContent className="p-2 bg-white shadow-md rounded-md">
                          <ContextMenuItem
                            onClick={() => handleCopyMessage(msg.content)}
                            className="cursor-pointer hover:bg-gray-100 p-2 dark:text-black"
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
            <div ref={messageEndRef} />
          </div>

          {isTyping ? (
            <div className="bg-gray-500 text-sm text-gray-500 dark:text-white ml-6">
              typing...
            </div>
          ) : null}

          

          {/* Input Bar */}
          <div className="border-t px-6 py-4 bg-white dark:bg-gray-800 flex items-center gap-3 dark:border-gray-700">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={typeHandler}
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

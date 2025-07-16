import { Pane } from "split-pane-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HiOutlineSearch } from "react-icons/hi";
import { Input } from "../ui/input";
import { useTheme } from "../theme-provider";
import { useEffect, useState } from "react";
import { searchUser } from "@/api/auth/Searchapi";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { FaEllipsisV, FaTimes } from "react-icons/fa";
import { getOrCreateNewChat, getUserChats } from "@/api/chat/Chatapi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { useChat } from "@/context/Chatcontext";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Chat {
  _id: string;
  chatName: string;
  latestMessage: string;
  users: User[];
  isGroupChat: boolean;
}

const LeftPanel: React.FC<{
  setSelectedChatId: (chatId: string | null) => void;
  selectedChatId: string | null;
}> = ({ setSelectedChatId, selectedChatId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { chatList, setChatList } = useChat();
  const user = useSelector((state: RootState) => state.user.user);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Handle search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(() => {
      searchUser(searchTerm)
        .then((res) => setSearchResults(res.data))
        .catch((error) => console.log("Search Error:", error));
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Fetch chats when user is available
  useEffect(() => {
    if (user) {
      const getUsersChats = async () => {
        try {
          const response = await getUserChats();
          setChatList(response.data); // Update the global chat list here
        } catch (error) {
          console.log(error);
        }
      };
      getUsersChats();
    }
  }, [user, setChatList]);

  // Create a new chat
  const handleCreateNewChat = async (userId: string) => {
    try {
      const response = await getOrCreateNewChat(userId);
      const newChat = response.data;

      // Update chat list using context
      setChatList((prevChats) => {
        if (!prevChats.find((chat) => chat._id === newChat._id)) {
          return [newChat, ...prevChats];
        }
        return prevChats;
      });

      setSelectedChatId(newChat._id);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // Clear search term
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <Pane minSize={200} maxSize={500} className="h-full">
      <div
        className={`h-full relative p-4 overflow-y-auto ${
          theme.theme === "light" ? "bg-gray-100" : "bg-gray-500"
        }`}
      >
        {/* Chats and Search in one row */}
        <div className="flex items-center mb-4 space-x-4 relative z-10">
          <h3 className="text-xl font-semibold whitespace-nowrap flex-shrink-0 select-none">
            Chats
          </h3>
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-slate-600 pl-10 dark:border-gray-300"
            />
            <HiOutlineSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={12}
            />
            {searchTerm && (
              <FaTimes
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                size={18}
                onClick={handleClearSearch}
              />
            )}
            {searchResults.length > 0 && (
              <div className="absolute w-full bg-white dark:bg-gray-800 border rounded-md mt-2 shadow-lg z-50 max-h-64 overflow-y-auto">
                {searchResults
                  .filter((u: any) => u._id !== user?._id)
                  .map((user: any) => (
                    <div
                      key={user._id}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                      onClick={() => {
                        navigate(`/profile/${user._id}`);
                        setSearchTerm("");
                        setSearchResults([]);
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage />
                        <AvatarFallback className="bg-gray-300 text-black">
                          {user.firstName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-500 hover:bg-gray-300 dark:bg-gray-700 ml-auto cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateNewChat(user._id);
                          setSearchResults([]);
                          setSearchTerm("");
                        }}
                      >
                        Message
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat List */}
        <ul className="z-0 relative">
          {chatList.map((chat: Chat, index: number) => {
            let chatDisplayName = chat.chatName;

            if (!chat.isGroupChat && user) {
              const otherUser = chat.users.find((u) => u._id !== user._id);
              if (otherUser) {
                chatDisplayName = `${otherUser.firstName} ${otherUser.lastName}`;
              }
            }

            return (
              <div key={chat._id}>
                <li
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer mb-2 ${
                    selectedChatId === chat._id
                      ? "bg-blue-100 text-black"
                      : theme.theme === "light"
                      ? "hover:bg-blue-100"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedChatId(chat._id)}
                >
                  <div className="flex items-center gap-4 flex-grow overflow-hidden">
                    <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-gray-500 rounded-full">
                      <AvatarImage />
                      <AvatarFallback className="text-lg bg-gray-200 dark:bg-white text-gray-800 dark:text-black dark:border-white select-none">
                        {chatDisplayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="font-medium truncate select-none">
                        {chatDisplayName}
                      </div>
                      {/* <div className="text-sm opacity-70 truncate select-none">
                        {chat.latestMessage}
                      </div> */}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <FaEllipsisV
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-white"
                        size={18}
                      />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      sideOffset={5}
                      className="w-40"
                    >
                      <DropdownMenuItem
                        onClick={() => alert("Delete chat clicked")}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                {index < chatList.length - 1 && (
                  <Separator className="my-1 bg-gray-400 h-1 w-20 mx-auto" />
                )}
              </div>
            );
          })}
        </ul>
      </div>
    </Pane>
  );
};

export default LeftPanel;

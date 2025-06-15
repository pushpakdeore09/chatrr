import { createContext, useContext, useState } from "react";

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

interface ChatContextProps {
  chatList: Chat[];
  setChatList: React.Dispatch<React.SetStateAction<Chat[]>>;
  notification: any,
  setNotification: any
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [notification, setNotification] = useState([]);

  return (
    <ChatContext.Provider
      value={{ chatList, setChatList, notification, setNotification }}
    >{children}</ChatContext.Provider>
  );
};

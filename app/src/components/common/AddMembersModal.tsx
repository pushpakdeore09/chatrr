import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUser } from "@/api/auth/Searchapi";
import { addToGroup } from "@/api/chat/Chatapi";
import { useChat } from "@/context/Chatcontext";
import toast from "react-hot-toast";



interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

interface Group {
  _id: string;
  chatName: string;
  users: User[];
  groupAdmin: string;
  createdAt: string;
} 
interface AddMembersModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onGroupUpdated: (updatedChat: Group) => void;
}

const AddMembersModal = ({ open, setOpen, onGroupUpdated }: AddMembersModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { currentChatId } = useChat();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(() => {
      searchUser(searchTerm)
        .then((res) => {
          const filtered = res.data.filter(
            (user: User) => !selectedUsers.some((sel) => sel._id === user._id)
          );
          setSearchResults(filtered);
        })
        .catch((err) => console.error("Search Error:", err));
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, selectedUsers]);

  const addUser = (user: User) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearchTerm("");
    setSearchResults([]);
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleAddMembers = async () => {
    const userIds = selectedUsers.map((user)=> user._id)
    console.log(currentChatId);
    const membersToAdd = {
        chatId: currentChatId,
        userIds: userIds
    }
    try {
        const response = await addToGroup(membersToAdd);
        if(response.data){
            toast.success(response.data.message);
            //onGroupUpdated(updatedChat);
            setOpen(false);
        }
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Select Friends</DialogTitle>
          <DialogDescription>Search and select friends for your group</DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-slate-600 py-2 dark:border-gray-300"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 max-h-60 overflow-y-auto rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 shadow-lg mt-1">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => addUser(user)}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} />
                    ) : (
                      <AvatarFallback className="bg-gray-300 text-black">
                        {user.firstName?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-3">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="relative inline-flex flex-col items-center"
                title={`${user.firstName} ${user.lastName}`}
              >
                <Avatar className="h-10 w-10">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} />
                  ) : (
                    <AvatarFallback className="bg-gray-300 text-black select-none">
                      {user.firstName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <button
                  onClick={() => removeUser(user._id)}
                  className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-red-600 focus:outline-none select-none"
                  aria-label="Remove user"
                  type="button"
                >
                  ×
                </button>
                <span className="mt-1 text-xs text-center select-none max-w-[60px] truncate">
                  {user.firstName}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => {
                setSelectedUsers([]);
            }}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0}
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;

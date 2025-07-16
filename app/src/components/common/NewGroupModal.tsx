import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HiUserGroup } from "react-icons/hi";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { searchUser } from "@/api/auth/Searchapi";
import toast from "react-hot-toast";
import { createGroupChat } from "@/api/chat/Chatapi";
import { useChat } from "@/context/Chatcontext";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

interface Chat {
  _id: string;
  chatName: string;
  latestMessage: string;
  users: User[];
  isGroupChat: boolean;
}

const NewGroupModal = () => {
  const [open, setOpen] = useState(false);
  const { setChatList } = useChat();
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

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

  const resetAll = () => {
    setGroupName("");
    setSearchTerm("");
    setSearchResults([]);
    setSelectedUsers([]);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetAll();
    }
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length <= 1) {
      toast.error("Please select at least two friends to create a group.");
      return;
    }

    const groupInfo = {
      chatName: groupName,
      users: selectedUsers,
    };

    try {
      const response = await createGroupChat(groupInfo);
      const newGroup = response.data;
      console.log(newGroup);

      setChatList((prevChats: Chat[]) => {
        if (!prevChats.find((chat) => chat._id === newGroup._id)) {
          return [newGroup, ...prevChats];
        }
        return prevChats;
      });

      setOpen(false);
      resetAll();

      toast.success("Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("There was an error creating the group.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-2 cursor-pointer"
          title="Create New Group"
          onClick={() => setOpen(true)}
        >
          <HiUserGroup className="w-5 h-5" />
          <span className="select-none">New Group +</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Enter group details below to create a new chat group.
          </DialogDescription>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full rounded border border-slate-600 dark:border-gray-300 py-2 mt-4"
        />

        {/* Search Input */}
        <div className="relative mt-4">
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-slate-600 py-2 dark:border-gray-300"
          />
          {/* Search results dropdown */}
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

        {/* Selected Users Avatars */}

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
                {/* Remove button */}
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
            <Button variant="outline" className="cursor-pointer select-none">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer select-none"
            onClick={() => {
              handleCreateGroup();
              setOpen(false);
              resetAll();
            }}
            disabled={!groupName || selectedUsers.length === 0}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupModal;

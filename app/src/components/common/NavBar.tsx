import { FaEllipsisV } from "react-icons/fa";
import { useTheme } from "../theme-provider";
import NewGroupModal from "./NewGroupModal";
import { ModeToggle } from "../mode-toggle";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import toast from "react-hot-toast";
import { logout } from "@/api/auth/Authapi";
import { setUser } from "@/store/userSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.data) {
        toast.success(response.data);

        dispatch(setUser(null));
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while Logout!");
    }
  };
  return (
    <nav
      className={`flex items-center justify-between px-6 py-6 shadow-md ${
        theme.theme === "light"
          ? "bg-white text-gray-800"
          : "bg-gray-800 text-white"
      }`}
    >
      <div
        className="text-3xl font-bold tracking-wide cursor-pointer select-none"
        title="Chatrr"
      >
        <span
          className={
            theme.theme === "light" ? "text-blue-600" : "text-blue-400"
          }
        >
          Chatrr
        </span>
      </div>
      <div className="flex items-center space-x-4 gap-2">
        <NewGroupModal />
        <span
          className="cursor-pointer hover:opacity-80 transition-opacity text-black dark:text-white"
          title="Notifications"
          onClick={() => console.log("Notification clicked")}
        >
        </span>
        <Avatar
          className="w-10 h-10 cursor-pointer text-black hover:opacity-80 transition-opacity dark:text-white"
          title="Profile"
          onClick={() => {
            if (user) {
              navigate(`/profile/${user._id}`);
            }
          }}
        >
          <AvatarImage />
          <AvatarFallback className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white">
            {user
              ? `${user.firstName?.[0]?.toUpperCase() || ""}${
                  user.lastName?.[0]?.toUpperCase() || ""
                }`
              : ""}
          </AvatarFallback>
        </Avatar>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span
              className="cursor-pointer hover:opacity-80 transition-opacity text-black dark:text-white"
              title="Menu"
            >
              <FaEllipsisV className="w-5 h-5" />
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className={`w-40 ${
              theme.theme === "light" ? "bg-white" : "bg-gray-700 text-white"
            }`}
          >
            <DropdownMenuItem
              onClick={() => user && navigate(`/profile/${user._id}`)}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;

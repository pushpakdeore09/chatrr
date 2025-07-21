import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { getChat } from "@/api/chat/Chatapi";
import { Button } from "@/components/ui/button";
import AddMembersModal from "@/components/common/AddMembersModal";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface Group {
  _id: string;
  chatName: string;
  users: User[];
  groupAdmin: string;
  createdAt: string;
}

const GroupInfoPage = () => {
  const { _id } = useParams<{ _id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
 const [modalOpen, setModalOpen] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const adminUser = group?.users.find((user) => user._id === group.groupAdmin);

  useEffect(() => {
    if (!_id) return;

    const getGroupInfo = async () => {
      try {
        const response = await getChat(_id);
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group info:", error);
      }
    };

    getGroupInfo();
  }, [_id, setModalOpen]);

  const handleGroupUpdate = (updatedGroup: Group) => {
  setGroup(updatedGroup);
};

  return (
    <div
      className={`min-h-screen p-10 ${
        theme.theme === "light"
          ? "bg-blue-100 text-gray-800"
          : "bg-gray-900 text-white"
      }`}
    >
      <div className="max-w-lg mx-auto">
        <Card className="dark:bg-gray-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold select-none">
              {group?.chatName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 select-none">
              Created on{" "}
              {group?.createdAt
                ? new Date(group.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}{" "}
              by{" "}
              <span className="font-medium">
                {adminUser
                  ? `${adminUser.firstName} ${adminUser.lastName}`
                  : "Admin"}
              </span>
            </p>
          </CardHeader>

          <Separator className="dark:text-gray-800" />
            
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Members</h3>
            <ul>
              {group?.users.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-default"
                >
                  <Avatar className="w-10 h-10">
                    {user.profilePicture ? (
                      <AvatarImage
                        src={user.profilePicture}
                        alt="User avatar"
                      />
                    ) : (
                      <AvatarFallback className="select-none">
                        {user.firstName?.[0]?.toUpperCase() || ""}
                        {user.lastName?.[0]?.toUpperCase() || ""}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="select-none cursor-pointer" onClick={() => {
                    navigate(`/profile/${user._id}`)
                  }}>{`${user.firstName} ${user.lastName}`}</span>
                  {user._id == group.groupAdmin && (
                    <span className="ml-auto px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-semibold select-none">
                      Admin
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className='flex justify-center items-center'>
              <Button className='cursor-pointer select-none' onClick={() => setModalOpen(true)}>Add Friends</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <AddMembersModal open={modalOpen} setOpen={setModalOpen} onGroupUpdated={handleGroupUpdate}/>
    </div>
  );
};

export default GroupInfoPage;

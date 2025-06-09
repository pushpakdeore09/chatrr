import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import EditProfileModal, {
  type UserProfile,
} from "../components/common/EditProfileModal";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

const ProfilePage = () => {
  const theme = useTheme();
  const { _id } = useParams<{ _id: string }>();

  const [user, setUser] = useState<UserProfile>({
    profilePicture: "https://i.pravatar.cc/150?img=8",
    firstName: "Jane",         
    lastName: "Doe",
    bio: "Loves tech, coffee, and late-night debugging.",
    phoneNumber: "+1 (555) 123-4567",
    dob: "1994-04-15",
    gender: "Female",
  });

  const [editOpen, setEditOpen] = useState(false);

  const handleSave = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <div
      className={`min-h-screen p-10 ${
        theme.theme === "light" ? "bg-blue-100 text-gray-800" : "bg-gray-900 text-white"
      }`}
    >
      <div className="max-w-md mx-auto px-4">
        <Card className='dark:bg-gray-500'>
          <CardHeader className="flex flex-col items-center text-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profilePicture} alt="Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl select-none">{user.firstName} {user.lastName}</CardTitle>
          </CardHeader>

          <Separator className='dark:text-gray-800'
          />

          <CardContent className="space-y-4 mt-4">
            <div>
              <Label className="text-muted-foreground dark:text-gray-800">Bio</Label>
              <p>{user.bio}</p>
            </div>

            <div>
              <Label className="text-muted-foreground dark:text-gray-800">Phone Number</Label>
              <p>{user.phoneNumber}</p>
            </div>

            <div>
              <Label className="text-muted-foreground dark:text-gray-800">Date of Birth</Label>
              <p>{user.dob}</p>
            </div>

            <div>
              <Label className="text-muted-foreground dark:text-gray-800">Gender</Label>
              <p>{user.gender}</p>
            </div>

            <div className="pt-4">
              <Button onClick={() => setEditOpen(true)}>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <EditProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          user={user}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ProfilePage;

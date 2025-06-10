import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export interface UserProfile {
  profilePicture: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  phoneNumber: string;
  dob: string;
  gender: string;
}

const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dob, setDob] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [gender, setGender] = useState<string>("");

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Profile Picture URL</Label>
            <Input
              name="profilePicture"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Bio</Label>
            <Textarea
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Phone Number</Label>
            <Input
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              name="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Gender</Label>
            <Input
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;

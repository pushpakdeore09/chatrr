import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
  user: UserProfile
  onSave: (updated: UserProfile) => void
}

export interface UserProfile {
  profilePicture: string
  firstName: string,
  lastName: string,
  bio: string
  phoneNumber: string
  dob: string
  gender: string
}

const EditProfileModal = ({ open, onClose, user, onSave }: EditProfileModalProps) => {
  const [formData, setFormData] = useState<UserProfile>(user)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Profile Picture URL</Label>
            <Input name="profilePicture" value={formData.profilePicture} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label>Bio</Label>
            <Textarea name="bio" value={formData.bio} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label>Phone Number</Label>
            <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label>Date of Birth</Label>
            <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label>Gender</Label>
            <Input name="gender" value={formData.gender} onChange={handleChange} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal

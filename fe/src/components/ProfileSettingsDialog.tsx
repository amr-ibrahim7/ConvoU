'use client';

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiErrorResponse {
  message: string;
}

export default function ProfileSettingsDialog({ isOpen, onClose }: ProfileSettingsDialogProps) {
  const { authUser, updateProfileName, updatePassword } = useAuthStore();

  const [fullName, setFullName] = useState(authUser?.fullName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleNameUpdate = async () => {
    if (fullName === authUser?.fullName || !fullName) return;
    setError('');
    setIsSubmitting(true);
    try {
      await updateProfileName(fullName);
      onClose();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError((err.response?.data as ApiErrorResponse)?.message || "Failed to update name.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      return setError("Please fill in all password fields.");
    }
    setError('');
    setIsSubmitting(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      onClose();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError((err.response?.data as ApiErrorResponse)?.message || "Failed to update password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" value={authUser.email} readOnly disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="col-span-3" />
          </div>
          <Button onClick={handleNameUpdate} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Name"}
          </Button>

          <Separator className="my-4" />

          {authUser.isGoogleUser ? (
            <div className="text-center text-sm text-muted-foreground p-4 bg-muted rounded-md">
              You&apos;ve logged in with Google. Password management is not available.
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold">Change Password</h3>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentPassword" className="text-right">Current</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right">New</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="col-span-3" />
              </div>
              <Button onClick={handlePasswordUpdate} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
              </Button>
            </div>
          )}

          {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { MoreVertical, Volume2Icon, VolumeXIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"; // لاستخدام القائمة
import { useChatStore } from "@/store/ useChatStore";
import ProfileSettingsDialog from "./ProfileSettingsDialog";

export default function ProfileHeader() {
  const { authUser, updateProfileImage } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too large. Maximum size is 2MB.");
    }
    
    const toastId = toast.loading("Uploading new profile picture...");

    try {
      await updateProfileImage(file);
      toast.success("Profile picture updated!", { id: toastId });
    } catch (error) {
      toast.error("Failed to update profile picture.", { id: toastId });
    }
  };
  

  const mouseClickSound = new Audio('/sounds/mouse-click.mp3');

  if (!authUser) {
    return (
      <div className="p-4 lg:p-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-full bg-white/10 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
              <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 border-b border-white/5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="size-14 rounded-full relative group"
              onClick={() => fileInputRef.current?.click()}
              title="Change Profile Picture"
            >
              <Avatar className="size-full border-2 border-white/10">
                <AvatarImage src={authUser.profilePic ||  '/home/avatar.png'} alt={authUser.fullName} />
                <AvatarFallback className="bg-white/5 text-white">
                  {authUser.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3 w-3 lg:h-3.5 lg:w-3.5 rounded-full border-2 border-slate-800 bg-emerald-500 z-9999"></div>
            </button>

            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-base font-medium text-white">{authUser.fullName}</h3>
            <p className="text-xs text-white/50">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => {
              mouseClickSound.play().catch(console.error);
              toggleSound();
            }}
          >
            {isSoundEnabled ? <Volume2Icon className="size-5" /> : <VolumeXIcon className="size-5" />}
          </Button>


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5 rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
    
              <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)} className="cursor-pointer">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => useAuthStore.getState().logout()} className="text-red-500 cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>


      <ProfileSettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
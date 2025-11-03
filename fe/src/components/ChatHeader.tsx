'use client';


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { MoreVertical, Phone, Video, ArrowLeft, XIcon, Wand2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useChatStore } from "@/store/ useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function ChatHeader({ onAiPanelToggle }: { onAiPanelToggle: () => void }) {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore(); 


  if (!selectedUser) return null;
  const isOnline = onlineUsers.includes(selectedUser.id);

  return (
    <div className="p-3 lg:p-4 border-b border-white/5 backdrop-blur-sm bg-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-9 w-9 text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => setSelectedUser(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Avatar className="h-9 w-9 lg:h-10 lg:w-10 border border-white/10">
              <AvatarImage src={selectedUser.profilePic || ''} alt={selectedUser.fullName} />
              <AvatarFallback>{selectedUser.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 lg:h-3 lg:w-3 rounded-full border-2 border-slate-800 ${
                isOnline ? 'bg-emerald-500' : 'bg-gray-500'
              }`}
            ></div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{selectedUser.fullName}</h3>
            <p className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-white/50'}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 lg:gap-2">

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 text-white/70 hover:text-white hover:bg-white/5">
                <Phone className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Feature Not Available</AlertDialogTitle><AlertDialogDescription>Voice calls are coming soon!</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogAction>OK</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 text-white/70 hover:text-white hover:bg-white/5">
                <Video className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Feature Not Available</AlertDialogTitle><AlertDialogDescription>Video calls are coming soon!</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogAction>OK</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 lg:h-9 lg:w-9 text-white/70 hover:text-white hover:bg-white/5"
            onClick={onAiPanelToggle}
          >
            <Wand2 className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 text-white/70 hover:text-white hover:bg-white/5">
            <MoreVertical className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>


          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex h-8 w-8 lg:h-9 lg:w-9 text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => setSelectedUser(null)}
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
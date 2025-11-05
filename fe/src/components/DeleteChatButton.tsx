import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteChatButtonProps {
  conversationId: string;
  chatName: string;
  onDelete: (conversationId: string) => void;
}

export default function DeleteChatButton({
  conversationId,
  chatName,
  onDelete,
}: DeleteChatButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/60 hover:text-red-500 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Delete Conversation?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/60">
            Are you sure you want to delete your conversation with{" "} 
            <span className="font-semibold text-white">{chatName}</span> ? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 text-white border-white/10">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(conversationId)}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
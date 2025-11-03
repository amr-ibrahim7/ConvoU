"use client";

import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/ useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
      <div className="flex items-center justify-center size-16 rounded-full bg-white/5 border border-white/10">
        <MessageSquarePlus className="size-8 text-white/40" />
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white">
          No Conversations Yet
        </h4>
        <p className="text-xs text-white/50 max-w-xs mx-auto">
          You haven&apos;t started any conversations. Go to the contacts tab to
          find someone to chat with.
        </p>
      </div>

      <Button
        variant="outline"
        className="bg-white/5 border-white/20 hover:bg-white/10 text-white/80"
        onClick={() => setActiveTab("contacts")}
      >
        Find Contacts
      </Button>
    </div>
  );
}

export default NoChatsFound;

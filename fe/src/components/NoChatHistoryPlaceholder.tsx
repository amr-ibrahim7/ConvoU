'use client';

import { useChatStore } from "@/store/ useChatStore";
import { MessageSquarePlus } from "lucide-react";


interface NoChatHistoryPlaceholderProps {
  onPromptClick: (prompt: string) => void;
}

const NoChatHistoryPlaceholder = ({ onPromptClick }: NoChatHistoryPlaceholderProps) => {
  const { selectedUser } = useChatStore();

  const prompts = [
    "👋 Say Hello!",
    "How are you?",
    "What are you up to?",
  ];

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
      
      <div className="flex items-center justify-center size-16 rounded-full bg-white/5 border border-white/10">
        <MessageSquarePlus className="size-8 text-white/40" />
      </div>
      
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-white">
          Start your conversation with {selectedUser.fullName}
        </h4>
        <p className="text-sm text-white/50 max-w-xs mx-auto">
          This is the beginning of your direct message history. Send a message to get things started!
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center pt-4">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="px-4 py-2 text-xs font-medium text-white/70 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
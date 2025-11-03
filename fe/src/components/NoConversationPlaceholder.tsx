import { MessageCircle } from "lucide-react";

export default function NoConversationPlaceholder () {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 lg:px-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full"></div>
            <MessageCircle size={64} className="relative text-white/30 lg:w-20 lg:h-20" strokeWidth={1} />
          </div>
          <h2 className="text-xl lg:text-2xl font-light text-white mb-2">Welcome to U.CONVO</h2>
          <p className="text-sm lg:text-base text-white/50 max-w-md">
            Select a chat to start messaging or find new people in Contacts.
          </p>
        </div>
      );
  };
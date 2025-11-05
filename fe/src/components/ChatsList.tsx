"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import NoChatsFound from "./NoChatsFound";
import { Skeleton } from "./ui/skeleton";
import { useChatStore, type Chat } from "@/store/ useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import DeleteChatButton from "./DeleteChatButton";

export default function ChatsList({ searchTerm }: { searchTerm: string }) {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
    unreadMessages,
    deleteConversation,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  const filteredChats = chats.filter((chat) =>
    chat.otherParticipant.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (isUsersLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return <NoChatsFound />;
  }

  if (filteredChats.length === 0) {
    return (
      <div className="text-center text-white/50 mt-10">
        No chats found for `${searchTerm}`
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredChats.map((chat: Chat) => {
        const isOnline = onlineUsers.includes(chat.otherParticipant.id);
        const unreadCount = unreadMessages[chat.conversationId] || 0;

        return (
          <div
            key={chat.conversationId}
            className="relative group"
            onMouseEnter={() => setHoveredChatId(chat.conversationId)}
            onMouseLeave={() => setHoveredChatId(null)}
          >
            <button
              onClick={() => setSelectedUser(chat.otherParticipant)}
              className={`w-full p-3 rounded-xl hover:bg-white/5 transition-all ${
                selectedUser?.id === chat.otherParticipant.id
                  ? "bg-white/10"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-11 w-11 border border-white/10">
                    <AvatarImage
                      src={
                        chat.otherParticipant.profilePic || "/home/avatar.png"
                      }
                    />
                    <AvatarFallback className="bg-white/5 text-white text-sm">
                      {chat.otherParticipant.fullName
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 ${
                      isOnline ? "bg-emerald-500" : "bg-gray-500"
                    }`}
                  ></div>

{unreadCount > 0 && (
                      <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/50 ring-2 ring-slate-800">
                        {unreadCount}
                      </div>
                    )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-medium text-white truncate">
                      {chat.otherParticipant.fullName}
                    </h4>
                    {chat.lastMessage && (
                      <span className="text-xs text-white/40 ml-2">
                        {new Date(
                          chat.lastMessage.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/50 truncate">
                      {chat.lastMessage?.text ||
                        (chat.lastMessage?.image && "📷 Image") ||
                        "No messages yet"}
                    </p>
                    {/* {unreadCount > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )} */}
                  </div>
                </div>
              </div>
            </button>

            <div
              className={`absolute top-8 right-2`}
            >
              <DeleteChatButton
                conversationId={chat.conversationId}
                chatName={chat.otherParticipant.fullName}
                onDelete={deleteConversation}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

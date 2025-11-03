"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { useChatStore, type Contact } from "@/store/ useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function ContactList({ searchTerm }: { searchTerm: string }) {
  const {
    getAllContacts,
    allContacts,
    setSelectedUser,
    isUsersLoading,
    selectedUser,
    setActiveTab,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const filteredContacts = allContacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContact = (contact: Contact) => {
    setSelectedUser(contact);
    setActiveTab("chats");
  };

  if (filteredContacts.length === 0 && allContacts.length > 0) {
    return (
      <div className="text-center text-white/50 mt-10">
        No contacts found for `${searchTerm}`
      </div>
    );
  }

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

  if (allContacts.length === 0) {
    return (
      <div className="text-center text-white/50 mt-10">
        No other users found.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredContacts.map((contact: Contact) => {
        const isOnline = onlineUsers.includes(contact.id);

        return (
          <button
            key={contact.id}
            onClick={() => handleSelectContact(contact)}
            className={`w-full p-3 rounded-xl hover:bg-white/5 transition-all group ${
              selectedUser?.id === contact.id ? "bg-white/10" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-11 w-11 border border-white/10">
                  <AvatarImage src={contact.profilePic || ""} />
                  <AvatarFallback className="bg-white/5 text-white text-sm">
                    {contact.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 ${
                    isOnline ? "bg-emerald-500" : "bg-gray-500"
                  }`}
                ></div>
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {contact.fullName}
                </h4>

                <p
                  className={`text-xs truncate ${
                    isOnline ? "text-emerald-400" : "text-white/50"
                  }`}
                >
                  {isOnline ? "Available to chat" : "Not available now!"}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

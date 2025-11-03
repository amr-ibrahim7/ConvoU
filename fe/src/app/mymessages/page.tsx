"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";
import { useChatStore } from "@/store/ useChatStore";
import ProfileHeader from "@/components/ProfileHeader";
import ChatsList from "@/components/ChatsList";
import ContactList from "@/components/ContactList";
import ChatContainer from "@/components/ChatContainer";
import NoConversationPlaceholder from "@/components/NoConversationPlaceholder";
import AuthProvider from "@/components/AuthProvider";


export default function ChatPage() {
  const { activeTab, setActiveTab, selectedUser } = useChatStore();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AuthProvider>
      <main className="flex items-center justify-center min-h-screen bg-black pt-16 pb-16 lg:pt-20 lg:pb-0">
        <div className="flex w-full h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] overflow-hidden bg-black">
          {/* On mobile: hide when chat is selected, On desktop: always show */}
          <div
            className={`${
              selectedUser ? "hidden" : "flex"
            } md:flex w-full md:w-80 lg:w-96 bg-black border-r border-white/5 flex-col transition-all duration-300`}
          >
            <ProfileHeader />

            {/* Search Bar */}
            <div className="p-3 lg:p-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search by name..."
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="p-3 lg:p-4">
              <Tabs
                value={activeTab}
                onValueChange={(value) => {
                  if (value === "chats" || value === "contacts") {
                    setActiveTab(value);
                  }
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 h-10">
                  <TabsTrigger
                    value="chats"
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 text-sm"
                  >
                    Chats
                  </TabsTrigger>
                  <TabsTrigger
                    value="contacts"
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 text-sm"
                  >
                    Contacts
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 lg:p-3">
                {activeTab === "chats" ? (
                  <ChatsList searchTerm={searchTerm} />
                ) : (
                  <ContactList searchTerm={searchTerm} />
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area  */}
          {/* On mobile: show full width when chat selected, On desktop: always show beside sidebar */}
          <div
            className={`${
              selectedUser ? "flex w-full" : "hidden"
            } md:flex md:flex-1 flex-col bg-black`}
          >
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}

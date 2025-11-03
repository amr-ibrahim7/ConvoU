"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useChatStore, type Message } from "@/store/ useChatStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";

import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2, Paperclip, Send, Smile, X ,Wand2 } from "lucide-react";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import AiInsightsPanel from "./AiInsightsPanel";


export default function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    sendMessage,
    clearUnreadMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser.id);
      const chat = useChatStore
        .getState()
        .chats.find((c) => c.otherParticipant.id === selectedUser.id);
      if (chat) {
        clearUnreadMessages(chat.conversationId);
      }
    }
  }, [selectedUser, getMessagesByUserId, clearUnreadMessages]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File is too large. Maximum size is 2MB.");
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !imageFile) return;
    if (!selectedUser) return;

    setIsSending(true);
    try {
      await sendMessage(selectedUser.id, messageText, imageFile);

      setMessageText("");
      setImageFile(null);
      setImagePreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } finally {
      setIsSending(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-black">
   <ChatHeader onAiPanelToggle={() => setIsAiPanelOpen(!isAiPanelOpen)} />

      <ScrollArea className="flex-1 h-0 p-4 lg:p-6">
        {isMessagesLoading ? (
          <div className="p-4 lg:p-6 space-y-4">
            <Skeleton className="h-16 w-3/4 rounded-lg self-start" />
            <Skeleton className="h-12 w-1/2 rounded-lg self-end ml-auto" />
            <Skeleton className="h-20 w-2/3 rounded-lg self-start" />
            <Skeleton className="h-12 w-1/2 rounded-lg self-end ml-auto" />
          </div>
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder
            onPromptClick={(prompt) => setMessageText(prompt)}
          />
        ) : (
          <div className="p-4 lg:p-6 space-y-4 pb-4">
            {messages.map((msg: Message) => {
              const isMe = msg.senderId === authUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] lg:max-w-[70%] ${
                      isMe ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {!isMe && (
                      <Avatar className="h-7 w-7 lg:h-8 lg:w-8 border border-white/10 self-end">
                        <AvatarImage src={selectedUser.profilePic || ""} />
                        <AvatarFallback>
                          {selectedUser.fullName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          isMe
                            ? "bg-white text-black rounded-br-none"
                            : "bg-white/5 text-white border border-white/10 rounded-bl-none"
                        }`}
                      >
                        {msg.image && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="relative w-48 h-48 mb-2 cursor-pointer">
                                <Image
                                  src={msg.image}
                                  alt="Sent image"
                                  layout="fill"
                                  className="rounded-md object-cover"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl h-auto bg-transparent border-0">
                              <Image
                                src={msg.image}
                                alt="Enlarged image"
                                layout="responsive"
                                width={700}
                                height={700}
                                className="rounded-lg object-contain"
                              />
                            </DialogContent>
                          </Dialog>
                        )}

                        {msg.text && <p className="text-sm">{msg.text}</p>}
                      </div>
                      <span
                        className={`text-xs text-white/40 mt-1 ${
                          isMe ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
        className="p-3 lg:p-4 border-t border-white/5 backdrop-blur-sm bg-white/5 space-y-2"
      >
        {imagePreview && (
          <div className="relative w-24 h-24">
            <Image
              src={imagePreview}
              alt="Image preview"
              layout="fill"
              className="rounded-md object-cover"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
                if (imageInputRef.current) imageInputRef.current.value = "";
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => imageInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-10 focus:bg-white/10 h-10"
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
              }}
              disabled={isSending}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/70 hover:text-white hover:bg-white/5"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Feature Not Available</AlertDialogTitle>
                  <AlertDialogDescription>
                    Emoji picker is coming soon!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Button
            type="submit"
            className="bg-white hover:bg-white/90 text-black h-10 w-10 shrink-0"
            disabled={isSending || (!messageText.trim() && !imageFile)}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      <Dialog open={isAiPanelOpen} onOpenChange={setIsAiPanelOpen}>
        <DialogContent className="p-0 border-0 bg-transparent max-w-lg w-full">
          <AiInsightsPanel />
        </DialogContent>
      </Dialog>
    </div>
  );
}

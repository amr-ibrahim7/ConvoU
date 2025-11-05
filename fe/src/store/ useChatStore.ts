import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { AxiosError } from "axios";
import { useAuthStore } from "./useAuthStore";

export interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  fullName: string;
  profilePic?: string | null;
}

export interface Message {
  id: string;
  text?: string | null;
  image?: string | null;
  senderId: string;
  conversationId: string;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    profilePic?: string | null;
  };
  receiverId?: string;
}

export interface Chat {
  conversationId: string;
  otherParticipant: {
    id: string;
    fullName: string;
    profilePic?: string | null;
  };
  lastMessage: Message | null;
}

export interface Insight {
  id: string;
  conversationId: string;
  summary: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  createdAt: string;
}

interface ChatState {
  allContacts: Contact[];
  chats: Chat[];
  messages: Message[];
  activeTab: "chats" | "contacts";
  selectedUser: User | Contact | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  unreadMessages: Record<string, number>;
  insight: Insight | null;
  isInsightLoading: boolean;
  getInsightForConversation: (conversationId: string) => Promise<void>;
  setUnreadMessages: (conversationId: string, count: number) => void;
  clearUnreadMessages: (conversationId: string) => void;
  initSound: () => void;

  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (user: User | Contact | null) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (
    receiverId: string,
    text?: string,
    image?: File | null
  ) => Promise<void>;
  addMessage: (message: Message) => void;
  refetchChats: () => Promise<void>;

  deleteConversation: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  // isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",
  isSoundEnabled: false,

  initSound: () => {
    if (typeof window !== "undefined") {
      const savedSoundSetting =
        localStorage.getItem("isSoundEnabled") === "true";
      set({ isSoundEnabled: savedSoundSetting });
    }
  },

  toggleSound: () => {
    set((state) => {
      const newSoundState = !state.isSoundEnabled;
      if (typeof window !== "undefined") {
        localStorage.setItem("isSoundEnabled", String(newSoundState));
      }
      return { isSoundEnabled: newSoundState };
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/message/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to fetch contacts."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/message/conversations");
      set({ chats: res.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to fetch chats.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  refetchChats: async () => {
    try {
      const res = await axiosInstance.get("/api/message/conversations");
      set({ chats: res.data });
    } catch (error) {
      console.error("Failed to refetch chats:", error);
    }
  },

  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/api/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch messages.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred while fetching messages.");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // unreadMessagesCount: 0,
  unreadMessages: {},

  setUnreadMessages: (conversationId, count) =>
    set((state) => ({
      unreadMessages: { ...state.unreadMessages, [conversationId]: count },
    })),

  clearUnreadMessages: (conversationId) =>
    set((state) => {
      const newUnreadMessages = { ...state.unreadMessages };
      delete newUnreadMessages[conversationId];
      return { unreadMessages: newUnreadMessages };
    }),

  sendMessage: async (
    receiverId: string,
    text?: string,
    image?: File | null
  ) => {
    const formData = new FormData();
    if (text) formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      const response = await axiosInstance.post(
        `/api/message/send/${receiverId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newMessage = response.data;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      get().refetchChats();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to send message.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  },

  addMessage: (message: Message) => {
    const { selectedUser, messages, chats } = get();
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) return;

    const messageExists = messages.some((msg) => msg.id === message.id);
    if (messageExists) return;

    const chat = chats.find((c) => c.conversationId === message.conversationId);

    const isChatOpen =
      selectedUser && chat && chat.otherParticipant.id === selectedUser.id;

    if (isChatOpen) {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    } else {
      if (message.senderId !== authUser.id) {
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [message.conversationId]:
              (state.unreadMessages[message.conversationId] || 0) + 1,
          },
        }));
      }
    }
    get().refetchChats();
  },

  insight: null,
  isInsightLoading: false,

  getInsightForConversation: async (conversationId: string) => {
    set({ isInsightLoading: true, insight: null });
    try {
      const res = await axiosInstance.get(`/api/insights/${conversationId}`);
      set({ insight: res.data });
    } catch (error) {
      toast.error("Failed to generate AI insight. Please try again later.");
      console.error("Error fetching insight:", error);
    } finally {
      set({ isInsightLoading: false });
    }
  },

  deleteConversation: async (conversationId: string) => {
    const toastId = toast.loading("Deleting conversation...");
    try {
      await axiosInstance.delete(
        `/api/message/conversations/${conversationId}`
      );

      set((state) => ({
        chats: state.chats.filter((c) => c.conversationId !== conversationId),
      }));

      if (
        get().selectedUser &&
        get().chats.every(
          (c) => c.otherParticipant.id !== get().selectedUser?.id
        )
      ) {
        set({ selectedUser: null, messages: [] });
      }

      toast.success("Conversation deleted", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete conversation", { id: toastId });
      console.error("Error deleting conversation:", error);
    }
  },
}));

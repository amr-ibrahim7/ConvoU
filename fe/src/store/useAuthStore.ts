
import { create } from 'zustand';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/axios';
import { io, Socket } from "socket.io-client";
import { useChatStore } from './ useChatStore';


const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string | null;
  isGoogleUser?: boolean; 
}


interface ApiErrorResponse {
  message: string;
}

interface AuthState {
  authUser: User | null;
  socket: Socket | null; 
  onlineUsers: string[];
  isCheckingAuth: boolean;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  checkAuth: () => Promise<void>;
  signup: (data: { fullName?: string; email?: string; password?: string }) => Promise<void>;
  login: (data: { email?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileImage: (file: File) => Promise<void>;
  updateProfileName: (fullName: string) => Promise<void>;
  updatePassword: (passwords: { currentPassword: string; newPassword: string }) => Promise<void>;
  connectSocket: () => void; 
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set,get) => ({
  authUser: null,
   socket: null,
  onlineUsers: [],
  isCheckingAuth: true,
  isSubmitting: false,
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/api/auth/check');
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },


  signup: async (data) => {
    set({ isSubmitting: true });
    const toastId = toast.loading("Creating account...");
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully! Redirecting...", { id: toastId });
      get().connectSocket()
      setTimeout(() => { window.location.href = '/mymessages'; }, 1000);
    } catch (error) {
      toast.dismiss(toastId);
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },
  
  login: async (data) => {
    set({ isSubmitting: true });
    const toastId = toast.loading("Logging in...");
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successful! Redirecting...", { id: toastId });
      get().connectSocket();
      setTimeout(() => { window.location.href = '/mymessages'; }, 1000);
    } catch (error) {
      toast.dismiss(toastId);
      throw error; 
    } finally {
      set({ isSubmitting: false });
    }
  },

  logout: async () => {
    const toastId = toast.loading("Logging out...");

    get().disconnectSocket();
    try {
      await axiosInstance.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully", { id: toastId });
      setTimeout(() => { window.location.href = '/login'; }, 500);
    } catch (error) {
      toast.error("Failed to log out", { id: toastId });
    }
  },


  updateProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const res = await axiosInstance.put("/api/auth/update", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      set({ authUser: res.data });

    } catch (error) {
      console.error("Failed to update profile image:", error);
      throw error;
    }
  },

  updateProfileName: async (fullName) => {
    try {
      const res = await axiosInstance.put("/api/auth/update", { fullName });
      set((state) => ({ authUser: { ...state.authUser!, ...res.data } }));
      toast.success("Name updated successfully!");
    } catch (error) {
      console.error("Failed to update name:", error);
      throw error;
    }
  },

  updatePassword: async (passwords) => {
    try {
      const res = await axiosInstance.put("/api/auth/update-password", passwords);
      toast.success(res.data.message || "Password updated successfully!");
    } catch (error) {
      console.error("Failed to update password:", error);
      throw error;
    }
  },
 

  
  connectSocket: () => {
    const { authUser, socket } = get();

    if (authUser && !socket?.connected) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log("Socket connected successfully:", newSocket.id);
        set({ socket: newSocket });
      });

      newSocket.on('disconnect', () => {
        console.log("Socket disconnected.");
        set({ socket: null, onlineUsers: [] });
      });


      newSocket.on("getOnlineUsers", (userIds: string[]) => {
        set({ onlineUsers: userIds });
      });


      newSocket.on("newMessage", (newMessage) => {

        useChatStore.getState().addMessage(newMessage);
        

        if (newMessage.senderId !== get().authUser?.id && useChatStore.getState().isSoundEnabled) {
          const notificationSound = new Audio("/sounds/notification.mp3");
          notificationSound.play().catch(console.error);
        }
      });

      set({ socket: newSocket });
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null, onlineUsers: [] });
  },
}));
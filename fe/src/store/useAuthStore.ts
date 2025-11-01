
import { create } from 'zustand';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios'; // <-- 1. استيراد AxiosError


interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string | null;
}

// تعريف شكل الأخطاء المتوقعة من الـ API الخاص بك
interface ApiErrorResponse {
  message: string;
  // يمكنك إضافة خصائص أخرى إذا كان الباك-إند يرسلها، مثل errors
}

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSubmitting: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: { fullName?: string; email?: string; password?: string }) => Promise<void>;
  login: (data: { email?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSubmitting: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/api/auth/check');
      set({ authUser: res.data });
      
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
      setTimeout(() => { window.location.href = '/mymessages'; }, 1000);
    } catch (error) {
      // بدلاً من التعامل مع الخطأ هنا، قم بإلقائه
      toast.dismiss(toastId); // أغلق إشعار التحميل
      throw error; // أعد إلقاء الخطأ ليتم التقاطه في المكون
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
      setTimeout(() => { window.location.href = '/mymessages'; }, 1000);
    } catch (error) {
      // بدلاً من التعامل مع الخطأ هنا، قم بإلقائه
      toast.dismiss(toastId); // أغلق إشعار التحميل
      throw error; // أعد إلقاء الخطأ ليتم التقاطه في المكون
    } finally {
      set({ isSubmitting: false });
    }
  },

  logout: async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await axiosInstance.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully", { id: toastId });
      // تأخير بسيط قبل إعادة التوجيه لتحسين تجربة المستخدم
      setTimeout(() => { window.location.href = '/login'; }, 500);
    } catch (error) {
      toast.error("Failed to log out", { id: toastId });
    }
  },
}));
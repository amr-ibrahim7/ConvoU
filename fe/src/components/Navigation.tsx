'use client';

import { Home, MessageCircle, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { useChatStore } from '@/store/ useChatStore';




export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { authUser, logout } = useAuthStore(); 



  const unreadMessages = useChatStore((state) => state.unreadMessages);


  const totalUnreadCount = Object.values(unreadMessages).reduce((acc, count) => acc + count, 0);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const useTransparentStyle = pathname === '/' && !isScrolled;



  const headerClasses = useTransparentStyle
    ? 'bg-transparent text-white'
    : 'bg-background/80 text-foreground border-b border-border backdrop-blur-lg';

  const iconClasses = useTransparentStyle
    ? 'text-white/70 group-hover:text-white'
    : 'text-muted-foreground group-hover:text-foreground';

  const mobileTextClasses = useTransparentStyle
    ? 'text-white/50'
    : 'text-muted-foreground';

  return (
    <>
      {/* --- Desktop Header --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClasses}`}>
        <div className="container mx-auto flex items-center justify-between px-8 py-4">
          <Link href="/" className="text-2xl font-light tracking-wider">
            U.CONVO
          </Link>

          <nav className="hidden lg:flex items-center gap-4">
            <Link href='/' className="group flex items-center justify-center p-2 rounded-full" title="Home">
              <Home className={`size-5 ${iconClasses}`} />
            </Link>
            

             
            {authUser && (
              <Link href='/mymessages' className="group relative flex items-center justify-center p-2 rounded-full" title="Messages">
                <MessageCircle className={`size-5 ${iconClasses}`} />
                {totalUnreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </Link>
            )}


            {authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={authUser.profilePic || ''} alt={authUser.fullName} />
                      <AvatarFallback>
                        {authUser.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{authUser.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{authUser.email}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href='/login' className="group flex items-center justify-center p-2 rounded-full" title="Login">
                <LogIn className={`size-5 ${iconClasses}`} />
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* --- Mobile Navigation --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className={`border-t backdrop-blur-xl transition-colors duration-300 ${useTransparentStyle ? 'border-white/10 bg-black/80' : 'border-border bg-card/95'}`}>
          <div className="flex items-center justify-around px-4 py-2">
            <Link href='/' className="group flex flex-col items-center gap-1 p-2">
              <Home className={`size-6 ${iconClasses}`} />
              <span className={`text-xs ${mobileTextClasses}`}>Home</span>
            </Link>

            {authUser ? (
              <>
                 <Link href='/mymessages' className="group relative flex flex-col items-center gap-1 p-2">
                  <MessageCircle className={`size-6 ${iconClasses}`} />
                  <span className={`text-xs ${mobileTextClasses}`}>Chat</span>
                  {totalUnreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </Link>
                {/* <Link href='/profile' className="group flex flex-col items-center gap-1 p-2">
                  <UserIcon className={`size-6 ${iconClasses}`} />
                  <span className={`text-xs ${mobileTextClasses}`}>Profile</span>
                </Link> */}
                <button onClick={logout} className="group flex flex-col items-center gap-1 p-2">
                  <LogOut className={`size-6 ${iconClasses}`} />
                  <span className={`text-xs ${mobileTextClasses}`}>Logout</span>
                </button>
              </>
            ) : (
              <Link href='/login' className="group flex flex-col items-center gap-1 p-2">
                <LogIn className={`size-6 ${iconClasses}`} />
                <span className={`text-xs ${mobileTextClasses}`}>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
'use client';

import { Home, User, MessageCircle, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
  return (
    <>
      {/* Desktop Navigation  */}
      <nav className="fixed right-12 top-8 z-50 hidden lg:block">
        <div className="flex items-center gap-6">

          <Link href='/' className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10">
            <Home className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
          </Link>

          <Link href='/user' className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10">
            <User className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
          </Link>


          <Link href='/mymessages' className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10">
            <MessageCircle className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="border-t border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="flex items-center justify-around px-6 py-4">

            <Link href='/' className="group flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:bg-white/10">
                <Home className="h-6 w-6 text-white/70 transition-colors group-hover:text-white" />
              </div>
              <span className="text-xs text-white/50">Home</span>
            </Link>


            <Link href='/' className="group flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:bg-white/10">
                <ImageIcon className="h-6 w-6 text-white/70 transition-colors group-hover:text-white" />
              </div>
              <span className="text-xs text-white/50">Explore</span>
            </Link>

            <Link href='/mymessages' className="group flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:bg-white/10">
                <MessageCircle className="h-6 w-6 text-white/70 transition-colors group-hover:text-white" />
              </div>
              <span className="text-xs text-white/50">Chat</span>
            </Link>

            <Link href='/user' className="group flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:bg-white/10">
                <User className="h-6 w-6 text-white/70 transition-colors group-hover:text-white" />
              </div>
              <span className="text-xs text-white/50">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
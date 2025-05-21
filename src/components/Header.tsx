import { shadow } from '@/app/styles/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import DarkModeToggle from './DarkModeToggle'
import { getUser } from '@/app/auth/server'
import LogOutButton from './LogoutButton'
import { SidebarTrigger } from './ui/sidebar'

const Header = async () => {
  const user = await getUser();

  return (
    <header
      className="
        relative z-30 flex h-20 w-full items-center justify-between
        px-4 sm:px-10
        border-b border-zinc-200 dark:border-zinc-800
        shadow-md
      "
      style={{
        boxShadow: shadow,
      }}
    >
      {/* Left side: Sidebar trigger + Logo + Brand */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Link className="flex items-center gap-3 hover:opacity-90 transition-all" href="/">
          <Image
            src="/goatius.png"
            height={48}
            width={48}
            alt="logo"
            className="rounded-xl shadow"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-tight">GOAT</span>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-300">Notes</span>
          </span>
        </Link>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button
              asChild
              className="rounded-full px-5 py-2 font-medium text-base bg-gradient-to-tr from-indigo-500 to-blue-400 text-white shadow-md hover:from-indigo-600 hover:to-blue-500 transition"
            >
              <Link href="/sign-up" className="hidden sm:block">Sign Up</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-5 py-2 border-2 border-blue-400 text-blue-500 font-medium text-base hover:bg-blue-50 dark:hover:bg-zinc-800 transition"
            >
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;

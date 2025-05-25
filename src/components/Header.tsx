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
      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            {/* Sign Up Button */}
            <Button
              asChild
              className="
          hidden sm:inline-flex
          rounded-full px-4 py-2 text-sm font-medium
          text-white bg-gradient-to-r from-indigo-500 to-blue-500
          hover:from-indigo-600 hover:to-blue-600
          shadow hover:shadow-lg transition-all duration-200
        "
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>

            {/* Login Button */}
            <Button
              asChild
              variant="ghost"
              className="
          rounded-full px-4 py-2 text-sm font-medium
          text-blue-600 dark:text-blue-400
          border border-blue-400 dark:border-blue-500
          hover:bg-blue-50 dark:hover:bg-zinc-900
          transition-all duration-200
        "
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

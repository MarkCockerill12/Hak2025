import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { Users } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </span>
            <span className="font-bold text-xl">Green Team</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary">
            Events
          </Link>
          <Link href="/chatroom" className="text-sm font-medium transition-colors hover:text-primary">
            Community Chat
          </Link>
          <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
              <SignOutButton />
            </SignedOut>
          </div>
        </div>
      </div>
    </header>

  )
}

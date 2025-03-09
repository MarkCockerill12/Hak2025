import { Button } from "~/components/ui/button";
import { Users } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </span>
            <span className="font-bold text-xl">Green Team</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-md bold font-medium">Home</Button>
          </Link>
          <Link href="/events">
            <Button variant="ghost" className="text-md bold font-medium">Events</Button>
          </Link>
          <Link href="/chatroom">
            <Button variant="ghost" className="text-md bold font-medium">Community Chat</Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" className="text-md bold font-medium">Admin</Button>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

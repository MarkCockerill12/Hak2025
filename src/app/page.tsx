import Link from "next/link"
import { Button } from "../components/ui/button"
import { Users } from "lucide-react"
import Image from "next/image"
import { InteractiveGraph } from "~/components/custom/graph"
import { Impact } from "~/components/custom/impact"
import { UpcomingEvents } from "~/components/custom/upcoming"

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden flex items-center justify-center">
          {/* Background Image with Blur */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/hero.jpg"
              fill
              className="object-cover blur-lg"
              alt="Children playing in nature"
            />
            {/* Overlay for Better Text Contrast */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">
            <h1 className="text-white text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Connecting Children with Nature
            </h1>
            <p className="max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join The Green Team in our mission to support mental health and promote environmental conservation
              through nature connection.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
              <Link href="/events">
                <Button className="bg-green-600 hover:bg-green-700">Explore Events</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="text-black">Become a Volunteer</Button>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <InteractiveGraph />
        </section>

        <Impact />
        <UpcomingEvents />

      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </span>
              <span className="font-bold">Green Team</span>
            </div>
            <p className="text-sm text-gray-500">
              Connecting children and young people with nature, supporting mental health, and promoting environmental
              conservation.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <h3 className="font-semibold">Links</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/events" className="hover:underline">
                Events
              </Link>
              <Link href="/chatroom" className="hover:underline">
                Community Chat
              </Link>
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <h3 className="font-semibold">Contact</h3>
            <p className="text-sm text-gray-500">
              Edinburgh, Scotland
              <br />
              info@greenteam.org
              <br />
              +44 123 456 7890
            </p>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500 md:text-left">
              © 2025 The Green Team. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

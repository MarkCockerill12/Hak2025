import Link from "next/link"
import { Button } from "../components/ui/button"
import { CalendarIcon, MessageCircle, Users } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col">
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
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Connecting Children with Nature
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join The Green Team in our mission to support mental health and promote environmental conservation
                  through nature connection.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/events">
                    <Button className="bg-green-600 hover:bg-green-700">Explore Events</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="outline">Become a Volunteer</Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Children exploring nature"
                  className="rounded-lg object-cover aspect-video overflow-hidden"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Impact</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how we're making a difference in our community and environment.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <h3 className="text-4xl font-bold">1,200+</h3>
                <p className="text-gray-500">Children Engaged</p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-4xl font-bold">150+</h3>
                <p className="text-gray-500">Active Volunteers</p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-4xl font-bold">50+</h3>
                <p className="text-gray-500">Community Programs</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Upcoming Events</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join us for our next community activities and make a difference.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 lg:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <CalendarIcon className="h-6 w-6 text-green-600" />
                      <div className="font-semibold">June {10 + i}, 2025</div>
                    </div>
                    <h3 className="mt-4 text-xl font-bold">Nature Walk for Kids</h3>
                    <p className="mt-2 text-gray-500">
                      Join us for a guided nature walk designed for children to explore and learn about local wildlife.
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <Link href={`/events/${i}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/events/${i}/chat`}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>Chat</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/events">
                <Button variant="outline">View All Events</Button>
              </Link>
            </div>
          </div>
        </section>
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
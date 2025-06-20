import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  ArrowRight,
  Headphones,
  Scissors,
  Sparkles,
  Clock,
  Share2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="bg-background border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 py-2">
          <div className="font-sans text-xl font-medium tracking-tight">
            <span className="text-foreground">clipnetic</span>
            <span className="px-0.5 font-medium text-gray-500">/</span>
            <span className="text-foreground font-light">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="from-background to-secondary/20 bg-gradient-to-b px-4 py-20">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Transform Your Podcasts with{" "}
              <span className="text-primary">AI-Powered Clips</span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-10 max-w-3xl text-lg md:text-xl">
              Create engaging, shareable podcast clips in seconds. Clipnetic AI
              automatically identifies the most compelling moments from your
              podcasts.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="px-8">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary/20 px-4 py-18">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-14 text-center text-3xl font-bold">
              How Clipnetic AI Works
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 mb-6 rounded-full p-4">
                  <Headphones className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  Upload Your Podcast
                </h3>
                <p className="text-muted-foreground">
                  Simply upload your podcast episode and our AI will process the
                  audio.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 mb-6 rounded-full p-4">
                  <Sparkles className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our advanced AI identifies key moments, insights, and engaging
                  segments.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 mb-6 rounded-full p-4">
                  <Scissors className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Generate Clips</h3>
                <p className="text-muted-foreground">
                  Get perfectly timed clips ready to share on social media
                  platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-secondary/10 px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-16 text-center text-3xl font-bold">
              Why Choose Clipnetic AI
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <Clock className="text-primary mb-4 h-10 w-10" />
                <h3 className="mb-3 text-xl font-semibold">Save Time</h3>
                <p className="text-muted-foreground">
                  Automatically identify the best moments from your podcasts
                  without manually listening to hours of content.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <Share2 className="text-primary mb-4 h-10 w-10" />
                <h3 className="mb-3 text-xl font-semibold">
                  Increase Engagement
                </h3>
                <p className="text-muted-foreground">
                  Share bite-sized, engaging clips that are perfect for social
                  media and drive traffic to your full episodes.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <Sparkles className="text-primary mb-4 h-10 w-10" />
                <h3 className="mb-3 text-xl font-semibold">
                  AI-Powered Insights
                </h3>
                <p className="text-muted-foreground">
                  Our AI doesn&apos;t just clip—it understands context, emotion,
                  and key points in your conversations.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <Headphones className="text-primary mb-4 h-10 w-10" />
                <h3 className="mb-3 text-xl font-semibold">
                  Grow Your Audience
                </h3>
                <p className="text-muted-foreground">
                  Reach new listeners by sharing the most compelling moments
                  from your podcast across platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 px-4 py-20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to Transform Your Podcast?
            </h2>
            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg">
              Join thousands of podcasters who are saving time and growing their
              audience with Clipnetic AI.
            </p>
            <Button size="lg" asChild className="px-10">
              <Link href="/signup">Get Started Today</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background mt-auto border-t py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <div className="font-sans text-xl font-medium tracking-tight">
                <span className="text-foreground">clipnetic</span>
                <span className="px-0.5 font-medium text-gray-500">/</span>
                <span className="text-foreground font-light">AI</span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                © {new Date().getFullYear()} Clipnetic AI. All rights reserved.
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="mb-3 font-semibold">Product</h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-semibold">Company</h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-semibold">Legal</h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

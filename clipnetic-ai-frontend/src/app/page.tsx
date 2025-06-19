import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, Headphones, Scissors, Sparkles, Clock, Share2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="bg-background border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 py-2">
          <div className="font-sans text-xl font-medium tracking-tight">
            <span className="text-foreground">clipnetic</span>
            <span className="font-medium text-gray-500 px-0.5">/</span>
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
        <section className="bg-gradient-to-b from-background to-secondary/20 py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Transform Your Podcasts with <span className="text-primary">AI-Powered Clips</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Create engaging, shareable podcast clips in seconds. Clipnetic AI automatically identifies the most compelling moments from your podcasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="px-8">
                <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-18 px-4 bg-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-14">How Clipnetic AI Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Your Podcast</h3>
                <p className="text-muted-foreground">
                  Simply upload your podcast episode and our AI will process the audio.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our advanced AI identifies key moments, insights, and engaging segments.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                  <Scissors className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Generate Clips</h3>
                <p className="text-muted-foreground">
                  Get perfectly timed clips ready to share on social media platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-secondary/10">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Clipnetic AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Save Time</h3>
                <p className="text-muted-foreground">
                  Automatically identify the best moments from your podcasts without manually listening to hours of content.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <Share2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Increase Engagement</h3>
                <p className="text-muted-foreground">
                  Share bite-sized, engaging clips that are perfect for social media and drive traffic to your full episodes.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <Sparkles className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Our AI doesn&apos;t just clip—it understands context, emotion, and key points in your conversations.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <Headphones className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Grow Your Audience</h3>
                <p className="text-muted-foreground">
                  Reach new listeners by sharing the most compelling moments from your podcast across platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Podcast?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of podcasters who are saving time and growing their audience with Clipnetic AI.
            </p>
            <Button size="lg" asChild className="px-10">
              <Link href="/signup">Get Started Today</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="font-sans text-xl font-medium tracking-tight">
                <span className="text-foreground">clipnetic</span>
                <span className="font-medium text-gray-500 px-0.5">/</span>
                <span className="text-foreground font-light">AI</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                © {new Date().getFullYear()} Clipnetic AI. All rights reserved.
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-semibold mb-3">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground">About</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

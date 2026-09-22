import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Fingerprint, Search, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base text-text-primary flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-500 mr-2" />
          <span className="text-xl font-bold">TrustShield AI</span>
        </div>
        <nav className="flex items-center gap-4" aria-label="Landing navigation">
          <Button variant="ghost" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Unified AI-Powered <br className="hidden md:block" />
            <span className="text-blue-500">Digital Trust Platform</span>
          </h1>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Detect deepfakes, block phishing URLs, and monitor content streams in real-time with our advanced neural engine.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/demo">Try Demo Mode</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/dashboard">Login</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-surface">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Core Capabilities</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-base border border-border">
                <Fingerprint className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Media Forensics</h3>
                <p className="text-text-muted">Deep-dive analysis of images and videos using AI to detect manipulations and deepfakes instantly.</p>
              </div>
              <div className="p-6 rounded-2xl bg-base border border-border">
                <Search className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">SafeScan</h3>
                <p className="text-text-muted">Comprehensive sandbox URL and file analysis to stop phishing and malware before it reaches users.</p>
              </div>
              <div className="p-6 rounded-2xl bg-base border border-border">
                <ShieldCheck className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Content Guardian</h3>
                <p className="text-text-muted">Real-time monitoring of content streams and APIs to maintain digital trust at scale.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center border-t border-border text-text-muted">
        <p>© 2026 TrustShield AI. Built for the Hackathon.</p>
      </footer>
    </div>
  );
}

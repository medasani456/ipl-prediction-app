import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-foreground">IPL Predictor 2025</h1>
            <div className="space-x-2">
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" className="bg-white hover:bg-gray-100">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Predict & Win</h2>
            <p className="text-xl text-muted-foreground">
              Make your IPL 2025 match predictions and earn points for every correct guess!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" x2="4" y1="22" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Predict Matches</h3>
                <p className="text-muted-foreground">Predict the winners of all IPL 2025 matches and earn points.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 2v20"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Earn Points</h3>
                <p className="text-muted-foreground">
                  Get 10 points for each correct prediction to climb the leaderboard.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Share Points</h3>
                <p className="text-muted-foreground">Distribute your 10 points in any ratio to back multiple teams.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/login">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 IPL Predictor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


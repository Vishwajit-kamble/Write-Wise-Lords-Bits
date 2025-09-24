import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react"

export function Hero() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <div className="flex items-center space-x-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Zap className="h-4 w-4" />
          <span>AI-Powered Peer Review Platform</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          WriteWise: Transform Your{" "}
          <span className="text-primary">Writing Journey</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Get instant AI feedback, connect with peer reviewers, and track your progress. 
          The complete platform for students, reviewers, and faculty to collaborate on writing excellence.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">
              Start Writing Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/demo">Watch Demo</Link>
          </Button>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="container max-w-[64rem]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Smart Writing</h3>
              </div>
              <p className="text-muted-foreground">
                Rich text editor with real-time grammar suggestions and AI-powered feedback.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Peer Review</h3>
              </div>
              <p className="text-muted-foreground">
                Fair reviewer assignment with double-blind review process and detailed feedback.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                Track progress with detailed analytics and insights for students and faculty.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="container max-w-[64rem]">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Real-time Collaboration</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>LMS Integration</span>
          </div>
        </div>
      </div>
    </section>
  )
}

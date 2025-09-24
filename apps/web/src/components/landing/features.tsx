import { 
  Brain, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Clock,
  FileText,
  MessageSquare,
  Target,
  Globe
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Feedback",
      description: "Get instant feedback on structure, grammar, clarity, and argument strength using advanced NLP models.",
      details: ["Grammar suggestions", "Style improvements", "Structure analysis", "Originality check"]
    },
    {
      icon: Users,
      title: "Fair Peer Review",
      description: "Smart algorithm matches reviewers fairly, preventing bias and ensuring balanced workload distribution.",
      details: ["Double-blind reviews", "Workload balancing", "Bias prevention", "Quality assurance"]
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights for students, reviewers, and faculty with performance trends and metrics.",
      details: ["Progress tracking", "Common mistakes", "Performance trends", "Reviewer reliability"]
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "End-to-end encryption, GDPR compliance, and role-based access control for complete data protection.",
      details: ["Data encryption", "GDPR compliance", "Role-based access", "Secure storage"]
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Live editing, comments, and notifications keep everyone connected and engaged in the writing process.",
      details: ["Live editing", "Real-time comments", "Smart notifications", "Version history"]
    },
    {
      icon: Globe,
      title: "LMS Integration",
      description: "Seamless integration with Moodle, Canvas, and Google Classroom for streamlined workflow.",
      details: ["Moodle support", "Canvas integration", "Google Classroom", "Grade sync"]
    }
  ]

  return (
    <section className="py-24 bg-muted/50">
      <div className="container max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything You Need for Writing Excellence
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From AI-powered feedback to comprehensive analytics, WriteWise provides all the tools 
            needed for effective writing education and peer review.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Advanced Features</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-2">
              <FileText className="h-8 w-8 text-primary" />
              <h4 className="font-semibold">Rich Text Editor</h4>
              <p className="text-sm text-muted-foreground text-center">
                Markdown support with inline suggestions
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <h4 className="font-semibold">Comment System</h4>
              <p className="text-sm text-muted-foreground text-center">
                Threaded discussions and feedback
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Target className="h-8 w-8 text-primary" />
              <h4 className="font-semibold">Gamification</h4>
              <p className="text-sm text-muted-foreground text-center">
                Badges, streaks, and leaderboards
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Clock className="h-8 w-8 text-primary" />
              <h4 className="font-semibold">Deadline Tracking</h4>
              <p className="text-sm text-muted-foreground text-center">
                Smart reminders and progress monitoring
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

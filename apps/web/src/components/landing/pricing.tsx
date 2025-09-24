import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Pricing() {
  const plans = [
    {
      name: "Student",
      price: "Free",
      description: "Perfect for individual students getting started",
      features: [
        "Unlimited essay uploads",
        "AI-powered feedback",
        "Basic peer review",
        "Progress tracking",
        "Mobile app access",
        "Email support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Educator",
      price: "$29",
      period: "/month",
      description: "Ideal for teachers and small classes",
      features: [
        "Everything in Student",
        "Class management",
        "Advanced analytics",
        "Rubric customization",
        "Grade book integration",
        "Priority support",
        "LMS integration"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Institution",
      price: "Custom",
      description: "For schools and universities",
      features: [
        "Everything in Educator",
        "Unlimited students",
        "Custom branding",
        "Advanced security",
        "Dedicated support",
        "Custom integrations",
        "Training & onboarding"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <section className="py-24">
      <div className="container max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core AI feedback and peer review features.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! Students can use WriteWise completely free. Educators get a 14-day free trial with full access to all features.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely. You can cancel your subscription at any time with no cancellation fees or penalties.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">What LMS platforms do you support?</h4>
              <p className="text-sm text-muted-foreground">
                We integrate with Moodle, Canvas, Google Classroom, and most major LMS platforms through our API.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">Is my data secure?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, we use end-to-end encryption and are GDPR compliant. Your data is never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

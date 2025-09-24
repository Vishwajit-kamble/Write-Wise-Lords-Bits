"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    essaysSubmitted: number
    reviewsCompleted: number
    averageScore: number
    pendingReviews: number
    upcomingDeadlines: number
  }
  userRole: string
}

export function DashboardStats({ stats, userRole }: DashboardStatsProps) {
  const getStatsCards = () => {
    if (userRole === 'STUDENT') {
      return [
        {
          title: 'Essays Submitted',
          value: stats.essaysSubmitted,
          icon: FileText,
          description: 'Total essays you\'ve submitted',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950',
        },
        {
          title: 'Reviews Received',
          value: stats.reviewsCompleted,
          icon: Users,
          description: 'Peer reviews you\'ve received',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950',
        },
        {
          title: 'Average Score',
          value: `${stats.averageScore.toFixed(1)}/10`,
          icon: TrendingUp,
          description: 'Your average essay score',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-950',
        },
        {
          title: 'Pending Reviews',
          value: stats.pendingReviews,
          icon: Clock,
          description: 'Reviews still in progress',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-950',
        },
      ]
    } else if (userRole === 'REVIEWER') {
      return [
        {
          title: 'Reviews Completed',
          value: stats.reviewsCompleted,
          icon: CheckCircle,
          description: 'Reviews you\'ve completed',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950',
        },
        {
          title: 'Pending Reviews',
          value: stats.pendingReviews,
          icon: Clock,
          description: 'Reviews waiting for you',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-950',
        },
        {
          title: 'Average Score Given',
          value: `${stats.averageScore.toFixed(1)}/10`,
          icon: TrendingUp,
          description: 'Your average review score',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-950',
        },
        {
          title: 'Total Reviews',
          value: stats.reviewsCompleted + stats.pendingReviews,
          icon: Users,
          description: 'All reviews assigned to you',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950',
        },
      ]
    } else if (userRole === 'FACULTY') {
      return [
        {
          title: 'Total Essays',
          value: stats.essaysSubmitted,
          icon: FileText,
          description: 'Essays in your courses',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950',
        },
        {
          title: 'Reviews Completed',
          value: stats.reviewsCompleted,
          icon: CheckCircle,
          description: 'Reviews in your courses',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950',
        },
        {
          title: 'Class Average',
          value: `${stats.averageScore.toFixed(1)}/10`,
          icon: TrendingUp,
          description: 'Average score across all essays',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-950',
        },
        {
          title: 'Pending Reviews',
          value: stats.pendingReviews,
          icon: Clock,
          description: 'Reviews still in progress',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-950',
        },
      ]
    }

    return []
  }

  const statsCards = getStatsCards()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

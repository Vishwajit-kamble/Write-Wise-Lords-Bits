"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { TrendingUp, TrendingDown, Users, FileText, Clock } from "lucide-react"

interface AnalyticsDashboardProps {
  stats: {
    essaysSubmitted: number
    reviewsCompleted: number
    averageScore: number
    pendingReviews: number
    upcomingDeadlines: number
  }
  trends: Array<{
    date: string
    averageScore: number
    essayCount: number
  }>
  commonIssues: Array<{
    type: string
    count: number
    percentage: number
  }>
  userRole: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function AnalyticsDashboard({ 
  stats, 
  trends, 
  commonIssues, 
  userRole 
}: AnalyticsDashboardProps) {
  const getPerformanceInsight = () => {
    if (trends.length < 2) return null
    
    const latest = trends[trends.length - 1]
    const previous = trends[trends.length - 2]
    const change = latest.averageScore - previous.averageScore
    
    return {
      change,
      isPositive: change > 0,
      text: change > 0 ? 'improved' : 'declined'
    }
  }

  const performanceInsight = getPerformanceInsight()

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}/10</div>
            {performanceInsight && (
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {performanceInsight.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                {Math.abs(performanceInsight.change).toFixed(1)} points {performanceInsight.text} from last period
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Essays</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.essaysSubmitted}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'STUDENT' ? 'Your essays' : 'Course essays'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'REVIEWER' ? 'Your reviews' : 'Total reviews'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [value.toFixed(1), 'Score']}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Common Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Common Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={commonIssues}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {commonIssues.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Essay Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Essay Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [value, 'Essays']}
                />
                <Bar dataKey="essayCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commonIssues.map((issue, index) => (
                <div key={issue.type} className="flex items-center justify-between">
                  <span className="text-sm">{issue.type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${issue.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{issue.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion Rate</span>
              <span className="font-medium">
                {stats.reviewsCompleted > 0 
                  ? Math.round((stats.reviewsCompleted / (stats.reviewsCompleted + stats.pendingReviews)) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Review Time</span>
              <span className="font-medium">2.3 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Reviewers</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quality Score</span>
              <span className="font-medium">8.2/10</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

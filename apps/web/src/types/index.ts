export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'student' | 'reviewer' | 'faculty' | 'admin'

export interface Essay {
  id: string
  title: string
  content: string
  authorId: string
  author: User
  status: EssayStatus
  wordCount: number
  readingTime: number
  version: number
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
  dueDate?: Date
  courseId?: string
  course?: Course
  reviews: Review[]
  aiFeedback?: AIFeedback
}

export type EssayStatus = 'draft' | 'submitted' | 'under_review' | 'reviewed' | 'graded'

export interface Review {
  id: string
  essayId: string
  essay: Essay
  reviewerId: string
  reviewer: User
  status: ReviewStatus
  scores: ReviewScores
  comments: ReviewComment[]
  feedback: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export type ReviewStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue'

export interface ReviewScores {
  structure: number
  grammar: number
  clarity: number
  argumentStrength: number
  originality: number
  overall: number
}

export interface ReviewComment {
  id: string
  reviewId: string
  text: string
  position: {
    start: number
    end: number
  }
  type: 'suggestion' | 'question' | 'praise' | 'concern'
  createdAt: Date
  updatedAt: Date
}

export interface AIFeedback {
  id: string
  essayId: string
  scores: ReviewScores
  suggestions: AISuggestion[]
  summary: string
  createdAt: Date
}

export interface AISuggestion {
  id: string
  type: 'grammar' | 'style' | 'structure' | 'clarity'
  text: string
  suggestion: string
  position: {
    start: number
    end: number
  }
  confidence: number
}

export interface Course {
  id: string
  name: string
  description: string
  instructorId: string
  instructor: User
  students: User[]
  essays: Essay[]
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  totalEssays: number
  totalReviews: number
  averageScore: number
  commonIssues: CommonIssue[]
  performanceTrends: PerformanceTrend[]
  reviewerReliability: ReviewerReliability[]
}

export interface CommonIssue {
  type: string
  count: number
  percentage: number
}

export interface PerformanceTrend {
  date: string
  averageScore: number
  essayCount: number
}

export interface ReviewerReliability {
  reviewerId: string
  reviewer: User
  totalReviews: number
  averageRating: number
  consistencyScore: number
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export type NotificationType = 
  | 'essay_assigned'
  | 'review_completed'
  | 'feedback_ready'
  | 'deadline_reminder'
  | 'grade_available'

export interface DashboardStats {
  essaysSubmitted: number
  reviewsCompleted: number
  averageScore: number
  pendingReviews: number
  upcomingDeadlines: number
}

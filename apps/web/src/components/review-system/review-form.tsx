"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ThumbsUp,
  HelpCircle,
  Heart
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  essay: {
    id: string
    title: string
    content: string
    author: {
      name: string
      avatar?: string
    }
  }
  onSubmit: (data: {
    scores: {
      structure: number
      grammar: number
      clarity: number
      argumentStrength: number
      originality: number
      overall: number
    }
    feedback: string
    comments: Array<{
      text: string
      position: { start: number; end: number }
      type: 'suggestion' | 'question' | 'praise' | 'concern'
    }>
  }) => void
  isSubmitting?: boolean
}

export function ReviewForm({ essay, onSubmit, isSubmitting = false }: ReviewFormProps) {
  const [scores, setScores] = useState({
    structure: 0,
    grammar: 0,
    clarity: 0,
    argumentStrength: 0,
    originality: 0,
    overall: 0,
  })
  const [feedback, setFeedback] = useState("")
  const [comments, setComments] = useState<Array<{
    text: string
    position: { start: number; end: number }
    type: 'suggestion' | 'question' | 'praise' | 'concern'
  }>>([])

  const handleScoreChange = (category: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }))
  }

  const handleAddComment = (type: 'suggestion' | 'question' | 'praise' | 'concern') => {
    const text = prompt(`Add a ${type} comment:`)
    if (text) {
      setComments(prev => [...prev, {
        text,
        position: { start: 0, end: 0 }, // Would be set based on text selection
        type
      }])
    }
  }

  const handleSubmit = () => {
    if (scores.overall === 0) {
      alert("Please provide an overall score")
      return
    }
    
    onSubmit({ scores, feedback, comments })
  }

  const getScoreLabel = (score: number) => {
    if (score === 0) return "Not scored"
    if (score <= 3) return "Needs improvement"
    if (score <= 6) return "Satisfactory"
    if (score <= 8) return "Good"
    return "Excellent"
  }

  const getScoreColor = (score: number) => {
    if (score === 0) return "text-gray-500"
    if (score <= 3) return "text-red-500"
    if (score <= 6) return "text-yellow-500"
    if (score <= 8) return "text-blue-500"
    return "text-green-500"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Essay Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Reviewing: {essay.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
              {essay.author.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-muted-foreground">
              By {essay.author.name}
            </span>
          </div>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: essay.content }} />
          </div>
        </CardContent>
      </Card>

      {/* Scoring */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(scores).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <span className={cn("text-sm font-medium", getScoreColor(score))}>
                  {getScoreLabel(score)}
                </span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleScoreChange(category as keyof typeof scores, value)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors",
                      score >= value
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground text-muted-foreground hover:border-primary"
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComment('suggestion')}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Suggestion
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComment('praise')}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Praise
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComment('question')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Question
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComment('concern')}
            >
              <Heart className="h-4 w-4 mr-2" />
              Concern
            </Button>
          </div>
          
          {comments.length > 0 && (
            <div className="space-y-2">
              {comments.map((comment, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      comment.type === 'suggestion' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                      comment.type === 'praise' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                      comment.type === 'question' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      comment.type === 'concern' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    )}>
                      {comment.type}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide overall feedback on the essay..."
            className="w-full h-32 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || scores.overall === 0}
          size="lg"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Save, 
  Send, 
  Eye, 
  FileText, 
  Clock,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { calculateReadingTime, formatRelativeTime } from "@/lib/utils"

interface EssayEditorProps {
  essay?: {
    id: string
    title: string
    content: string
    status: string
    wordCount: number
    readingTime: number
    createdAt: string
    updatedAt: string
  }
  onSave: (data: { title: string; content: string }) => void
  onSubmit: () => void
  onGenerateAI: () => void
  isSaving?: boolean
  isSubmitting?: boolean
}

export function EssayEditor({ 
  essay, 
  onSave, 
  onSubmit, 
  onGenerateAI,
  isSaving = false,
  isSubmitting = false 
}: EssayEditorProps) {
  const [title, setTitle] = useState(essay?.title || "")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [wordCount, setWordCount] = useState(essay?.wordCount || 0)
  const [readingTime, setReadingTime] = useState(essay?.readingTime || 0)

  const editor = useEditor({
    extensions: [StarterKit],
    content: essay?.content || "",
    onUpdate: ({ editor }) => {
      const content = editor.getText()
      const words = content.split(/\s+/).filter(word => word.length > 0).length
      const time = calculateReadingTime(content)
      
      setWordCount(words)
      setReadingTime(time)
      
      // Auto-save after 2 seconds of inactivity
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = setTimeout(() => {
        handleSave()
      }, 2000)
    },
  })

  let autoSaveTimeout: NodeJS.Timeout

  const handleSave = () => {
    if (editor && title.trim()) {
      onSave({
        title: title.trim(),
        content: editor.getHTML(),
      })
      setLastSaved(new Date())
    }
  }

  const handleSubmit = () => {
    if (title.trim() && editor?.getText().trim()) {
      onSubmit()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
      case 'SUBMITTED':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950'
      case 'UNDER_REVIEW':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-950'
      case 'REVIEWED':
        return 'text-green-600 bg-green-50 dark:bg-green-950'
      case 'GRADED':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <FileText className="h-4 w-4" />
      case 'SUBMITTED':
        return <Send className="h-4 w-4" />
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4" />
      case 'REVIEWED':
        return <CheckCircle className="h-4 w-4" />
      case 'GRADED':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Essay Editor</h1>
          {essay && (
            <div className="flex items-center space-x-4 mt-2">
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(essay.status)
              )}>
                {getStatusIcon(essay.status)}
                <span className="ml-1">{essay.status.replace('_', ' ')}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                Last updated {formatRelativeTime(essay.updatedAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onGenerateAI}
            disabled={!title.trim() || !editor?.getText().trim()}
          >
            <Zap className="h-4 w-4 mr-2" />
            AI Feedback
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !editor?.getText().trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !editor?.getText().trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Words</span>
            </div>
            <p className="text-2xl font-bold mt-1">{wordCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Reading Time</span>
            </div>
            <p className="text-2xl font-bold mt-1">{readingTime} min</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Save className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Last Saved</span>
            </div>
            <p className="text-sm mt-1">
              {lastSaved ? formatRelativeTime(lastSaved) : 'Not saved'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Essay Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Essay Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your essay title..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Essay Content
            </label>
            <div className="border border-input rounded-md min-h-[400px]">
              <div className="border-b border-input p-2 bg-muted/50">
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive('bold') ? 'bg-accent' : ''}
                  >
                    <strong>B</strong>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive('italic') ? 'bg-accent' : ''}
                  >
                    <em>I</em>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={editor?.isActive('strike') ? 'bg-accent' : ''}
                  >
                    <s>S</s>
                  </Button>
                  <div className="w-px bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor?.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
                  >
                    H1
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor?.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
                  >
                    H2
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive('bulletList') ? 'bg-accent' : ''}
                  >
                    •
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={editor?.isActive('orderedList') ? 'bg-accent' : ''}
                  >
                    1.
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

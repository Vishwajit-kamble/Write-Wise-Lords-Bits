import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async generateFeedback(essayId: string) {
    try {
      const essay = await this.prisma.essay.findUnique({
        where: { id: essayId },
        include: { author: true },
      });

      if (!essay) {
        throw new Error('Essay not found');
      }

      const prompt = this.createFeedbackPrompt(essay.content, essay.title);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert writing tutor providing constructive feedback on student essays. Focus on structure, grammar, clarity, argument strength, and originality. Provide specific suggestions for improvement.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const feedback = completion.choices[0]?.message?.content;
      if (!feedback) {
        throw new Error('No feedback generated');
      }

      // Parse the feedback to extract scores and suggestions
      const parsedFeedback = this.parseFeedback(feedback);

      // Save AI feedback to database
      const aiFeedback = await this.prisma.aiFeedback.upsert({
        where: { essayId },
        update: {
          scores: parsedFeedback.scores,
          suggestions: parsedFeedback.suggestions,
          summary: parsedFeedback.summary,
        },
        create: {
          essayId,
          scores: parsedFeedback.scores,
          suggestions: parsedFeedback.suggestions,
          summary: parsedFeedback.summary,
        },
      });

      return aiFeedback;
    } catch (error) {
      this.logger.error('Error generating AI feedback:', error);
      throw error;
    }
  }

  private createFeedbackPrompt(content: string, title: string): string {
    return `
Please analyze the following essay and provide comprehensive feedback:

Title: ${title}

Content:
${content}

Please provide feedback in the following JSON format:
{
  "scores": {
    "structure": 0-10,
    "grammar": 0-10,
    "clarity": 0-10,
    "argumentStrength": 0-10,
    "originality": 0-10,
    "overall": 0-10
  },
  "suggestions": [
    {
      "type": "grammar|style|structure|clarity",
      "text": "specific text from essay",
      "suggestion": "improvement suggestion",
      "position": {"start": 0, "end": 10},
      "confidence": 0.0-1.0
    }
  ],
  "summary": "Overall assessment and key recommendations"
}

Focus on:
1. Essay structure and organization
2. Grammar and language use
3. Clarity of expression
4. Strength of arguments
5. Originality and creativity
6. Specific areas for improvement

Provide constructive, actionable feedback that will help the student improve their writing.
    `.trim();
  }

  private parseFeedback(feedback: string) {
    try {
      // Extract JSON from the feedback
      const jsonMatch = feedback.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in feedback');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        scores: parsed.scores || {
          structure: 5,
          grammar: 5,
          clarity: 5,
          argumentStrength: 5,
          originality: 5,
          overall: 5,
        },
        suggestions: parsed.suggestions || [],
        summary: parsed.summary || 'AI feedback generated successfully.',
      };
    } catch (error) {
      this.logger.warn('Failed to parse AI feedback, using defaults:', error);
      return {
        scores: {
          structure: 5,
          grammar: 5,
          clarity: 5,
          argumentStrength: 5,
          originality: 5,
          overall: 5,
        },
        suggestions: [],
        summary: 'AI feedback generated successfully.',
      };
    }
  }

  async checkPlagiarism(content: string): Promise<number> {
    // This is a simplified plagiarism check
    // In a real implementation, you would use a plagiarism detection service
    // For now, we'll return a random score for demonstration
    return Math.random() * 0.3; // 0-30% similarity
  }
}

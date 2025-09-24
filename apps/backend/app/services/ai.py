import asyncio
import json
from typing import Dict, Any
import google.generativeai as genai

from ..config import settings

def initialize_gemini():
    """Initialize Gemini API"""
    if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)

async def analyze_essay_async(essay_content: str) -> Dict[str, Any]:
    """
    Analyze essay content using Google Gemini Pro API
    Returns a dictionary with grammar_score, clarity_score, argument_score, and ai_summary
    """
    if not settings.gemini_api_key:
        # Return mock data if no API key is provided
        return {
            "grammar_score": 7.5,
            "clarity_score": 8.0,
            "argument_score": 7.0,
            "ai_summary": "This essay shows good structure and clear arguments. Consider improving grammar in some sections."
        }
    
    try:
        # Initialize Gemini
        initialize_gemini()
        
        # Create the model
        model = genai.GenerativeModel(settings.gemini_model)
        
        # Create the prompt
        prompt = f"""You are an expert essay reviewer. Analyze the provided essay and return a JSON response with the following structure:
        {{
            "grammar_score": <number between 0-10>,
            "clarity_score": <number between 0-10>,
            "argument_score": <number between 0-10>,
            "ai_summary": "<string with constructive feedback>"
        }}
        
        Essay to review:
        {essay_content}
        
        Please provide only the JSON response, no additional text."""
        
        # Generate content
        response = model.generate_content(prompt)
        
        if response.text:
            # Try to parse JSON from the response
            try:
                # Clean the response text (remove markdown code blocks if present)
                content = response.text.strip()
                if content.startswith("```json"):
                    content = content[7:]
                if content.startswith("```"):
                    content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
                
                result = json.loads(content.strip())
                
                # Validate the response structure
                required_keys = ["grammar_score", "clarity_score", "argument_score", "ai_summary"]
                if all(key in result for key in required_keys):
                    return result
                else:
                    raise ValueError("Missing required keys in response")
                    
            except (json.JSONDecodeError, ValueError) as e:
                # Fallback if response is not valid JSON
                return {
                    "grammar_score": 7.5,
                    "clarity_score": 8.0,
                    "argument_score": 7.0,
                    "ai_summary": response.text[:500] if response.text else "AI analysis completed"
                }
        else:
            # Fallback if no response text
            return {
                "grammar_score": 7.5,
                "clarity_score": 8.0,
                "argument_score": 7.0,
                "ai_summary": "AI analysis completed but no detailed feedback available"
            }
                
    except Exception as e:
        # Fallback on any error
        return {
            "grammar_score": 7.5,
            "clarity_score": 8.0,
            "argument_score": 7.0,
            "ai_summary": f"AI analysis failed: {str(e)}"
        }
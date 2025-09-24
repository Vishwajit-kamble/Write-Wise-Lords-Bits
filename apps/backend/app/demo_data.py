from sqlalchemy.orm import Session
from .db import SessionLocal, engine
from .models.base import Base
from .models.user import User, UserRole
from .models.essay import Essay
from .models.review import Review, ReviewStatus
from .security import hash_password
from datetime import datetime, timedelta
import random

def create_demo_data():
    """Create demo data for the application"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if demo data already exists
        if db.query(User).first():
            print("Demo data already exists!")
            return
        
        print("Creating demo data...")
        
        # Create demo users
        demo_users = [
            User(
                email="student1@demo.com",
                first_name="Alice",
                last_name="Johnson",
                role=UserRole.STUDENT,
                hashed_password=hash_password("password123"),
                is_active=True
            ),
            User(
                email="student2@demo.com", 
                first_name="Bob",
                last_name="Smith",
                role=UserRole.STUDENT,
                hashed_password=hash_password("password123"),
                is_active=True
            ),
            User(
                email="teacher@demo.com",
                first_name="Dr. Sarah",
                last_name="Wilson",
                role=UserRole.TEACHER,
                hashed_password=hash_password("password123"),
                is_active=True
            ),
            User(
                email="admin@demo.com",
                first_name="Admin",
                last_name="User",
                role=UserRole.ADMIN,
                hashed_password=hash_password("password123"),
                is_active=True
            )
        ]
        
        for user in demo_users:
            db.add(user)
        db.commit()
        
        # Refresh users to get their IDs
        db.refresh(demo_users[0])
        db.refresh(demo_users[1])
        db.refresh(demo_users[2])
        
        # Create demo essays
        demo_essays = [
            Essay(
                title="The Impact of Technology on Education",
                content="""Technology has revolutionized the way we learn and teach. From online classrooms to interactive learning tools, digital innovations have made education more accessible and engaging than ever before.

The benefits of educational technology are numerous. Students can now access vast amounts of information instantly, collaborate with peers globally, and learn at their own pace. Interactive simulations and virtual reality experiences bring complex concepts to life in ways that traditional textbooks cannot.

However, there are also challenges to consider. The digital divide means that not all students have equal access to technology. Additionally, there are concerns about screen time and the potential for technology to distract from deep learning.

Despite these challenges, the future of education is undoubtedly intertwined with technology. As we move forward, it's crucial to ensure that technological advances enhance rather than replace the human elements of teaching and learning.""",
                author_id=demo_users[0].id,
                is_draft=False,
                created_at=datetime.now() - timedelta(days=5)
            ),
            Essay(
                title="Climate Change: A Global Challenge",
                content="""Climate change represents one of the most pressing challenges of our time. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, are driving unprecedented changes in our planet's climate system.

The evidence is overwhelming. Global temperatures are rising, ice caps are melting, and extreme weather events are becoming more frequent and severe. These changes have profound implications for ecosystems, economies, and human societies worldwide.

Addressing climate change requires immediate and sustained action at all levels - from individual choices to international cooperation. This includes transitioning to renewable energy sources, implementing sustainable agricultural practices, and protecting natural carbon sinks like forests and oceans.

While the challenge is immense, there is still hope. Technological innovations in clean energy, along with growing public awareness and political will, provide pathways toward a more sustainable future. The time to act is now.""",
                author_id=demo_users[1].id,
                is_draft=False,
                created_at=datetime.now() - timedelta(days=3)
            ),
            Essay(
                title="The Power of Storytelling",
                content="""Storytelling is one of humanity's most fundamental forms of communication. Since the dawn of civilization, stories have served as vehicles for preserving history, sharing wisdom, and connecting people across cultures and generations.

Great stories have the power to inspire, educate, and transform. They can challenge our assumptions, broaden our perspectives, and help us understand complex human experiences. Through narrative, we can explore themes of love, loss, courage, and redemption in ways that resonate deeply with readers.

In our modern digital age, storytelling has evolved beyond traditional mediums. Social media, podcasts, and interactive media offer new platforms for narrative expression. However, the core principles of good storytelling remain unchanged: compelling characters, engaging plots, and meaningful themes.

As we continue to evolve as a society, the importance of storytelling will only grow. In a world increasingly divided by differences, stories have the unique ability to build bridges of understanding and empathy between people.""",
                author_id=demo_users[0].id,
                is_draft=True,
                created_at=datetime.now() - timedelta(days=1)
            )
        ]
        
        for essay in demo_essays:
            db.add(essay)
        db.commit()
        
        # Refresh essays to get their IDs
        db.refresh(demo_essays[0])
        db.refresh(demo_essays[1])
        
        # Create demo reviews
        demo_reviews = [
            Review(
                essay_id=demo_essays[0].id,
                reviewer_id=demo_users[2].id,
                comments="Excellent analysis of educational technology! Your discussion of both benefits and challenges shows balanced thinking. Consider adding more specific examples of successful tech implementations in schools.",
                grammar_score=8.5,
                clarity_score=9.0,
                argument_score=8.0,
                ai_summary="This essay demonstrates strong analytical skills with a balanced perspective on educational technology. The writing is clear and well-structured, though it could benefit from more concrete examples.",
                status=ReviewStatus.COMPLETED,
                created_at=datetime.now() - timedelta(days=2)
            ),
            Review(
                essay_id=demo_essays[1].id,
                reviewer_id=demo_users[2].id,
                comments="A compelling argument about climate change. Your scientific evidence is well-presented, and the call to action is powerful. The conclusion could be strengthened with more specific policy recommendations.",
                grammar_score=9.0,
                clarity_score=8.5,
                argument_score=9.5,
                ai_summary="Outstanding essay on climate change with strong scientific backing and persuasive argumentation. The writing is engaging and the message is clear and urgent.",
                status=ReviewStatus.COMPLETED,
                created_at=datetime.now() - timedelta(days=1)
            ),
            Review(
                essay_id=demo_essays[0].id,
                reviewer_id=None,
                comments=None,
                grammar_score=8.0,
                clarity_score=8.5,
                argument_score=7.5,
                ai_summary="AI Analysis: This essay provides a comprehensive overview of technology in education. The writing is clear and well-organized. Suggestions: Add more specific statistics and case studies to strengthen the argument.",
                status=ReviewStatus.AI_COMPLETED,
                created_at=datetime.now() - timedelta(hours=6)
            )
        ]
        
        for review in demo_reviews:
            db.add(review)
        db.commit()
        
        print("Demo data created successfully!")
        print("\nDemo Users:")
        print("- student1@demo.com (Alice Johnson) - Password: password123")
        print("- student2@demo.com (Bob Smith) - Password: password123") 
        print("- teacher@demo.com (Dr. Sarah Wilson) - Password: password123")
        print("- admin@demo.com (Admin User) - Password: password123")
        print(f"\nCreated {len(demo_users)} users, {len(demo_essays)} essays, and {len(demo_reviews)} reviews")
        
    except Exception as e:
        print(f"Error creating demo data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_data()

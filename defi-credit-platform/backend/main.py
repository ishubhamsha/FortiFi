from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from credit_scoring import CreditScorer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
credit_scorer = CreditScorer()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreditAssessmentRequest(BaseModel):
    wallet_address: str
    responses: Dict[str, str]
    on_chain_data: Dict[str, float]
    dao_scores: List[float]

@app.post("/assess-credit")
async def assess_credit(request: CreditAssessmentRequest):
    try:
        credit_assessment = credit_scorer.calculate_credit_score(
            request.responses,
            request.on_chain_data,
            request.dao_scores
        )
        return credit_assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Standard interview questions
@app.get("/interview-questions")
async def get_interview_questions():
    return {
        "questions": [
            "What is the primary purpose of this loan?",
            "How do you plan to repay this loan?",
            "What is your current source of income?",
            "Have you taken any loans before? How did you manage them?",
            "What collateral can you provide for this loan?"
        ]
    }

if _name_ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
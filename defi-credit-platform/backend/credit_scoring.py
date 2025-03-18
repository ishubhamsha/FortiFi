from transformers import DistilBertTokenizer, DistilBertModel
import torch
from typing import List, Dict
import numpy as np

class CreditScorer:
    def _init_(self):
        self.tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        self.model = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.model.eval()

    def _encode_text(self, text: str) -> torch.Tensor:
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).squeeze()

    def calculate_credit_score(self, 
                             responses: Dict[str, str], 
                             on_chain_data: Dict[str, float],
                             dao_scores: List[float]) -> Dict:
        # Combine all text responses
        text_input = " ".join(responses.values())
        
        # Get text embeddings
        text_features = self._encode_text(text_input)
        
        # Calculate base score from text responses (0-40 points)
        text_score = float(torch.sigmoid(text_features.mean()) * 40)
        
        # Calculate on-chain score (0-30 points)
        chain_score = min(30, sum([
            on_chain_data.get("previous_loans_repaid", 0) * 5,
            on_chain_data.get("collateral_ratio", 0) * 10,
            on_chain_data.get("wallet_age_years", 0) * 2
        ]))
        
        # Calculate DAO score (0-30 points)
        dao_score = sum(dao_scores) / len(dao_scores) if dao_scores else 0
        dao_score = min(30, dao_score)
        
        # Calculate final score
        final_score = text_score + chain_score + dao_score
        
        return {
            "final_score": final_score,
            "text_score": text_score,
            "chain_score": chain_score,
            "dao_score": dao_score,
            "risk_level": "Low" if final_score > 80 else "Medium" if final_score > 60 else "High",
            "max_loan_amount": self._calculate_max_loan(final_score),
            "recommended_interest_rate": self._calculate_interest_rate(final_score)
        }

    def _calculate_max_loan(self, score: float) -> float:
        """Calculate maximum loan amount based on credit score"""
        base_amount = 1000  # Base amount in platform tokens
        multiplier = score / 50  # Score-based multiplier
        return base_amount * multiplier

    def _calculate_interest_rate(self, score: float) -> float:
        """Calculate recommended interest rate based on credit score"""
        base_rate = 0.15  # 15% base APR
        score_discount = (score / 100) * 0.10  # Up to 10% discount
        return max(0.05, base_rate - score_discount)  # Minimum 5% APR
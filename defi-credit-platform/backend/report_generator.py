from datetime import datetime
from typing import Dict

class ReportGenerator:
    def generate_report(self, credit_assessment: Dict, face_auth_result: Dict) -> Dict:
        return {
            "report_id": datetime.now().strftime("%Y%m%d%H%M%S"),
            "timestamp": datetime.now().isoformat(),
            "credit_assessment": {
                "score": credit_assessment["final_score"],
                "risk_level": credit_assessment["risk_level"],
                "max_loan_amount": credit_assessment["max_loan_amount"],
                "interest_rate": credit_assessment["recommended_interest_rate"]
            },
            "score_breakdown": {
                "text_analysis": credit_assessment["text_score"],
                "blockchain_analysis": credit_assessment["chain_score"],
                "dao_participation": credit_assessment["dao_score"]
            },
            "face_verification": {
                "verified": face_auth_result["is_human"],
                "details": face_auth_result.get("details", {})
            },
            "recommendations": self._generate_recommendations(credit_assessment)
        }

    def _generate_recommendations(self, assessment: Dict) -> List[str]:
        recommendations = []
        if assessment["text_score"] < 20:
            recommendations.append("Consider providing more detailed responses to questions")
        if assessment["chain_score"] < 15:
            recommendations.append("Build more on-chain credit history")
        if assessment["dao_score"] < 15:
            recommendations.append("Increase DAO participation for better scores")
        return recommendations

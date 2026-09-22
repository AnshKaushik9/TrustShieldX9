import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

interface HumanValidationPromptProps {
  onSkip: () => void;
  onReviewRequired: () => void;
}

export function HumanValidationPrompt({ onSkip, onReviewRequired }: HumanValidationPromptProps) {
  return (
    <Card className="bg-surface border-border">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-text-primary">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          Human Validation Required
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-text-muted mb-6">
          AI Analysis is complete. You can opt to review the findings manually before generating the final report.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={onSkip}
            className="flex-1 bg-muted hover:bg-surface-hover text-white font-semibold py-3 rounded-lg transition-colors border border-border-muted"
          >
            Skip Human Review
          </button>
          <button 
            onClick={onReviewRequired}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Review Required
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

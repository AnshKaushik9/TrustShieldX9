import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ForensicsReport } from "@/lib/services/mediaForensicsService";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";
import { HumanValidation } from "@/lib/services/reviewSyncStore";

interface ReviewPanelProps {
  report: ForensicsReport;
  onSubmit: (validation: HumanValidation) => void;
}

export function ReviewPanel({ report, onSubmit }: ReviewPanelProps) {
  const [decision, setDecision] = useState<"Approve" | "Reject" | "Override">("Approve");
  const [overrideClass, setOverrideClass] = useState<"Authentic" | "Suspicious" | "AI Generated">("Authentic");
  const [notes, setNotes] = useState("");

  const isManipulated = report.riskBadge !== "Authentic";

  const handleSubmit = () => {
    let finalDecision = report.riskBadge;
    if (decision === "Reject") {
      finalDecision = isManipulated ? "Authentic" : "AI Generated"; // simplistic inverse
    } else if (decision === "Override") {
      finalDecision = overrideClass;
    }

    onSubmit({
      isReviewed: true,
      reviewer: "Admin",
      reviewTime: new Date().toISOString(),
      originalAiDecision: report.riskBadge,
      reviewerNotes: notes,
      finalDecision,
      decisionAction: decision
    });
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-text-primary">
          <User className="w-5 h-5 text-indigo-400" />
          Professional Review Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="bg-base rounded-xl p-4 flex justify-between items-center border border-border/50">
          <div>
            <p className="text-sm text-text-muted mb-1">AI Decision</p>
            <div className="flex items-center gap-2">
              {isManipulated ? <ShieldAlert className="w-5 h-5 text-danger-text" /> : <ShieldCheck className="w-5 h-5 text-success-text" />}
              <span className={`font-bold ${isManipulated ? "text-danger-text" : "text-success-text"}`}>
                {report.riskBadge}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted mb-1">Confidence</p>
            <p className="text-xl font-bold text-text-primary">{report.confidence}%</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-3">Reviewer Decision</label>
          <div className="flex gap-4">
            <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-2 ${decision === "Approve" ? "bg-indigo-600/20 border-indigo-500 text-indigo-300" : "border-border-muted text-text-muted hover:bg-muted"}`}>
              <input type="radio" name="decision" checked={decision === "Approve"} onChange={() => setDecision("Approve")} className="hidden" />
              Approve AI Decision
            </label>
            <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-2 ${decision === "Reject" ? "bg-danger-bg border-red-500 text-red-300" : "border-border-muted text-text-muted hover:bg-muted"}`}>
              <input type="radio" name="decision" checked={decision === "Reject"} onChange={() => setDecision("Reject")} className="hidden" />
              Reject AI Decision
            </label>
            <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-2 ${decision === "Override" ? "bg-warning-bg border-amber-500 text-amber-300" : "border-border-muted text-text-muted hover:bg-muted"}`}>
              <input type="radio" name="decision" checked={decision === "Override"} onChange={() => setDecision("Override")} className="hidden" />
              Override Classification
            </label>
          </div>
        </div>

        {decision === "Override" && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <label className="block text-sm font-medium text-text-muted mb-3">Select Classification</label>
            <div className="flex gap-4">
              {(["Authentic", "Suspicious", "AI Generated"] as const).map((cls) => (
                <label key={cls} className={`flex-1 border rounded-lg p-2 text-center cursor-pointer transition-colors ${overrideClass === cls ? "bg-indigo-600 border-indigo-500 text-white" : "border-border text-text-muted hover:bg-muted"}`}>
                  <input type="radio" checked={overrideClass === cls} onChange={() => setOverrideClass(cls)} className="hidden" />
                  {cls}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Reviewer Notes</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 bg-base border border-border rounded-lg p-3 text-text-primary focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            placeholder="Enter rationale or details about the review..."
          />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-600/25"
        >
          Submit Review
        </button>
      </CardContent>
    </Card>
  );
}

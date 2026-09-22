import { useState } from "react";
import { ReviewTask } from "@/lib/services/reviewSyncStore";
import { ShieldAlert, ShieldCheck, X } from "lucide-react";

interface ReviewModalProps {
  task: ReviewTask;
  onClose: () => void;
  onComplete: () => void;
}

export function ReviewModal({ task, onClose, onComplete }: ReviewModalProps) {
  const [decision, setDecision] = useState<"Approve" | "Reject" | "Override">("Approve");
  const [overrideClass, setOverrideClass] = useState<"Authentic" | "Suspicious" | "AI Generated">("Authentic");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isManipulated = task.aiDecision !== "Authentic";

  const handleSubmit = async () => {
    let finalDecision = task.aiDecision;
    if (decision === "Reject") {
      finalDecision = isManipulated ? "Authentic" : "AI Generated";
    } else if (decision === "Override") {
      finalDecision = overrideClass;
    }

    setIsSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          reviewer: "Admin",
          reviewerNotes: notes,
          finalDecision,
          decisionAction: decision
        })
      });
      onComplete();
      onClose();
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="bg-base border-b border-border p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary">Review Case: {task.id.split("-")[0]}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="bg-base rounded-xl p-4 flex justify-between items-center border border-border/50">
            <div>
              <p className="text-sm text-text-muted mb-1">AI Decision</p>
              <div className="flex items-center gap-2">
                {isManipulated ? <ShieldAlert className="w-5 h-5 text-danger-text" /> : <ShieldCheck className="w-5 h-5 text-success-text" />}
                <span className={`font-bold ${isManipulated ? "text-danger-text" : "text-success-text"}`}>
                  {task.aiDecision}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted mb-1">Confidence</p>
              <p className="text-xl font-bold text-text-primary">{task.confidence}%</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-3">Reviewer Decision</label>
            <div className="flex gap-4">
              <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-2 ${decision === "Approve" ? "bg-indigo-600/20 border-indigo-500 text-indigo-300" : "border-border-muted text-text-muted hover:bg-muted"}`}>
                <input type="radio" checked={decision === "Approve"} onChange={() => setDecision("Approve")} className="hidden" />
                Approve AI Decision
              </label>
              <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-2 ${decision === "Reject" ? "bg-danger-bg border-red-500 text-red-300" : "border-border-muted text-text-muted hover:bg-muted"}`}>
                <input type="radio" checked={decision === "Reject"} onChange={() => setDecision("Reject")} className="hidden" />
                Reject AI Decision
              </label>
              <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-2 ${decision === "Override" ? "bg-warning-bg border-amber-500 text-amber-300" : "border-border-muted text-text-muted hover:bg-muted"}`}>
                <input type="radio" checked={decision === "Override"} onChange={() => setDecision("Override")} className="hidden" />
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
        </div>

        <div className="p-4 border-t border-border bg-base flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-muted transition-colors font-medium">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

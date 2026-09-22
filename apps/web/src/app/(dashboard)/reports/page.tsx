import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function ReportsPage() {
  const tasks = await db.reviewTask.findMany();

  const safeCount = tasks.filter(t => t.aiDecision === "Authentic" || t.aiDecision === "Safe").length;
  const suspiciousCount = tasks.filter(t => t.aiDecision === "Suspicious" || (t.priority === "Medium" && t.aiDecision !== "Authentic")).length;
  const dangerousCount = tasks.filter(t => t.aiDecision === "Dangerous" || t.priority === "High").length;
  const deepfakesCount = tasks.filter(t => t.aiDecision === "Deepfake").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports Center</h1>
        <p className="text-text-muted mt-2">Analytics, history, and exports.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-text">{safeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-text">{suspiciousCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dangerous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger-text">{dangerousCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deepfakes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{deepfakesCount}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scan History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-text-muted text-center py-10">
            {tasks.length > 0 ? "Scan history is tracked in Dashboard." : "No history available to generate reports."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

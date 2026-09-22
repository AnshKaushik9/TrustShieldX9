import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SafeScanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SafeScan</h1>
        <p className="text-text-muted mt-2">Scan URLs, domains, and files for threats.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Scan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Enter URL or Hash..." className="max-w-xl" disabled />
            <Button disabled>Analyze (In Development)</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-text-muted text-center py-10">
            No recent scans.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

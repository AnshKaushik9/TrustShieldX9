import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function DemoModePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Demo Mode</h1>
        <p className="text-text-muted mt-2">Guided interactive sandbox experience.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Deepfake Image</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted mb-4">Simulates AI analysis of a manipulated image highlighting fake regions.</p>
            <Button className="w-full" variant="secondary"><PlayCircle className="mr-2 h-4 w-4" /> Start Scenario</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Phishing URL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted mb-4">Simulates scanning a typosquatted domain designed to steal credentials.</p>
            <Button className="w-full" variant="secondary"><PlayCircle className="mr-2 h-4 w-4" /> Start Scenario</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Malicious QR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted mb-4">Simulates decoding a QR code containing a hidden exploit payload.</p>
            <Button className="w-full" variant="secondary"><PlayCircle className="mr-2 h-4 w-4" /> Start Scenario</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

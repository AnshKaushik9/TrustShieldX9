import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ExtensionSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Extension Settings</h1>
        <p className="text-text-muted mt-2">Manage your TrustShield Chrome Extension preferences.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Connected Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Browser Status</label>
            <div className="text-success-text font-medium">Active and Synced</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

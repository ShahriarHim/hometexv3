import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsTabProps {
  onOpenPreferences: () => void;
}

export const SettingsTab = ({ onOpenPreferences }: SettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">Manage your account preferences</p>
          <Button variant="outline" onClick={onOpenPreferences}>
            Manage Preferences
          </Button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Security</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Change password and security settings
          </p>
          <Button variant="outline">Security Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

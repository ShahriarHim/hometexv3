import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface Preferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
}

interface PreferencesDialogProps {
  isOpen: boolean;
  preferences: Preferences;
  onOpenChange: (open: boolean) => void;
  onPreferenceChange: (key: keyof Preferences, value: boolean) => void;
  onSave: () => void;
}

export const PreferencesDialog = ({
  isOpen,
  preferences,
  onOpenChange,
  onPreferenceChange,
  onSave,
}: PreferencesDialogProps) => {
  const preferencesList = [
    {
      id: "email-notifications",
      key: "emailNotifications" as const,
      title: "Email Notifications",
      description: "Receive email notifications about your account",
    },
    {
      id: "order-updates",
      key: "orderUpdates" as const,
      title: "Order Updates",
      description: "Get notified about order status changes",
    },
    {
      id: "marketing-emails",
      key: "marketingEmails" as const,
      title: "Marketing Emails",
      description: "Receive promotional emails and special offers",
    },
    {
      id: "sms-notifications",
      key: "smsNotifications" as const,
      title: "SMS Notifications",
      description: "Receive text message notifications",
    },
    {
      id: "newsletter",
      key: "newsletter" as const,
      title: "Newsletter",
      description: "Subscribe to our newsletter for updates",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Account Preferences</DialogTitle>
          <DialogDescription>
            Manage your account preferences and notification settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            {preferencesList.map((preference, index) => (
              <div key={preference.id}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={preference.id} className="text-base">
                      {preference.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">{preference.description}</p>
                  </div>
                  <Switch
                    id={preference.id}
                    checked={preferences[preference.key]}
                    onCheckedChange={(checked) => onPreferenceChange(preference.key, checked)}
                  />
                </div>
                {index < preferencesList.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  customer_id?: number;
  [key: string]: string | number | undefined;
}

interface ProfileTabProps {
  isLoading: boolean;
  error: string | null;
  userProfile: UserProfile | null;
}

export const ProfileTab = ({ isLoading, error, userProfile }: ProfileTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading profile...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : userProfile ? (
          <>
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <p className="text-muted-foreground">{userProfile.name || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-muted-foreground">{userProfile.email || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p className="text-muted-foreground">{userProfile.phone || "Not provided"}</p>
            </div>
            {userProfile.address && (
              <div>
                <label className="text-sm font-medium">Address</label>
                <p className="text-muted-foreground">{userProfile.address}</p>
              </div>
            )}
            <Button>Edit Profile</Button>
          </>
        ) : (
          <p className="text-center py-8 text-muted-foreground">No profile data available</p>
        )}
      </CardContent>
    </Card>
  );
};

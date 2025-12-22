import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export const WishlistTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">View and manage your saved items</p>
        <Button asChild>
          <Link href="/account/wishlist">View Wishlist</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) => {
  return (
    <Card className="max-w-md mx-auto text-center">
      <CardContent className="pt-16 pb-16">
        <Icon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button asChild>
          <Link href={actionHref as never}>{actionLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

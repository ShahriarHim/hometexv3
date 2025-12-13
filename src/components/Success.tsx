"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { ReactNode } from "react";

interface SuccessProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export const Success = ({ title = "Success!", message, icon, actions, children }: SuccessProps) => {
  const defaultIcon = <CheckCircle className="h-16 w-16 text-green-500" />;

  return (
    <Card>
      <CardContent className="p-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center justify-center">{icon || defaultIcon}</div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{title}</h2>
            {message && <p className="text-muted-foreground text-lg">{message}</p>}
          </div>
          {children}
          {actions && <div className="flex flex-col sm:flex-row gap-4 mt-4">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

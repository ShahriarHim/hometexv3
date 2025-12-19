"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/routing";
import { LogIn } from "lucide-react";

interface LoginRequiredProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void; // Optional callback to close sidebar
}

export const LoginRequired = ({ isOpen, onOpenChange, onClose }: LoginRequiredProps) => {
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    onClose?.(); // Close sidebar if callback provided
    router.push("/auth");
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
    onClose?.(); // Close sidebar if callback provided
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          onClose?.(); // Close sidebar when dialog closes
        }
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-4">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Login Required</DialogTitle>
          <DialogDescription className="text-center mt-2">
            You need to be logged in to proceed with checkout. Please log in to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={handleLogin} className="w-full" size="lg">
            <LogIn className="h-4 w-4 mr-2" />
            Go to Login
          </Button>
          <Button onClick={handleContinueShopping} variant="outline" className="w-full" size="lg">
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-4xl",
  full: "max-w-full mx-4",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  className,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl mx-4",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          sizeClasses[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "absolute right-0 top-0 z-10 flex h-10 w-10 items-center justify-center",
              "rounded-bl-2xl bg-primary text-primary-foreground",
              "transition duration-150 ease-out",
              "hover:opacity-90 hover:translate-y-[1px] hover:translate-x-[-1px]",
              "active:translate-y-[2px] active:translate-x-[-2px]"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="max-h-[90vh] overflow-y-auto p-0">{children}</div>
      </div>
    </div>,
    document.body
  );
};

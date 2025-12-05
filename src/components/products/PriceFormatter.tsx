import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  if (amount === undefined || amount === null) {
    return null;
  }

  return (
    <span className={cn("font-medium", className)}>
      {amount.toLocaleString()}৳
    </span>
  );
};

export default PriceFormatter;


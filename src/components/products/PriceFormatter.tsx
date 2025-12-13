import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return <span className={cn("font-medium", className)}>0৳</span>;
  }

  return <span className={cn("font-medium", className)}>{amount.toLocaleString()}৳</span>;
};

export default PriceFormatter;

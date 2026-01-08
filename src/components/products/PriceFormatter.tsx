import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  const { formatPrice } = useCurrency();

  if (amount === undefined || amount === null || isNaN(amount)) {
    return <span className={cn("font-medium", className)}>{formatPrice(0)}</span>;
  }

  return (
    <span className={cn("font-medium", className)} suppressHydrationWarning>
      {formatPrice(amount)}
    </span>
  );
};

export default PriceFormatter;

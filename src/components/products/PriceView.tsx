import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  originalPrice?: number | undefined;
  discount: number | undefined;
  className?: string;
  priceClassName?: string;
}

const PriceView = ({ price, originalPrice, discount, className, priceClassName }: Props) => {
  // Use provided originalPrice, or calculate from discount if not provided
  const displayOriginalPrice =
    originalPrice || (price && discount && discount > 0 ? price / (1 - discount / 100) : null);

  return (
    <div className={twMerge("flex items-center justify-between gap-5", className)}>
      <div className="flex items-center gap-3">
        <PriceFormatter
          amount={price}
          className={cn("text-primary font-bold text-2xl", className, priceClassName)}
        />
        {displayOriginalPrice && displayOriginalPrice > (price || 0) && (
          <PriceFormatter
            amount={displayOriginalPrice}
            className={twMerge("line-through text-base font-medium text-gray-500", className)}
          />
        )}
      </div>
    </div>
  );
};

export default PriceView;

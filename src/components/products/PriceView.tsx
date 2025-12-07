import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  originalPrice?: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, originalPrice, discount, className }: Props) => {
  // Use provided originalPrice, or calculate from discount if not provided
  const displayOriginalPrice =
    originalPrice || (price && discount && discount > 0 ? price / (1 - discount / 100) : null);

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-3">
        <PriceFormatter
          amount={price}
          className={cn("text-[#2d8659] font-bold text-xl", className)}
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

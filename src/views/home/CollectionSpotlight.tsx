"use client";

import { collectionSpotlight } from "@/data/migration-content";

export const CollectionSpotlight = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Shop By Collections</h2>
      <div className="flex flex-nowrap gap-6 overflow-x-auto">
        {collectionSpotlight.map((category, index) => (
          <div
            key={category.id || index}
            className="flex flex-col items-center group cursor-pointer flex-shrink-0"
          >
            <div className="w-32 h-32 overflow-hidden [perspective:1000px] rounded-full">
              <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute w-full h-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white flex items-center justify-center">
                  <div className="absolute w-full h-full">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            <span
              className={`mt-2 font-bold`}
              style={{ color: category.accent || "hsl(var(--info))" }}
            >
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

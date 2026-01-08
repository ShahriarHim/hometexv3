"use client";

import { collectionSpotlight } from "@/data/migration-content";

export const CollectionSpotlight = () => {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Shop By Collections</h2>
      <div className="flex flex-nowrap gap-8 overflow-x-auto pb-4 scrollbar-hide justify-center">
        {collectionSpotlight.map((category, index) => {
          const isEven = index % 2 === 0;
          const roundedClass = isEven
            ? "rounded-tl-[80px] rounded-br-[80px]"
            : "rounded-tr-[80px] rounded-bl-[80px]";

          return (
            <div
              key={category.id || index}
              className="flex flex-col items-center group cursor-pointer flex-shrink-0"
            >
              <div className="w-[180px] aspect-square [perspective:1000px]">
                <div
                  className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${roundedClass}`}
                >
                  <div
                    className={`absolute inset-0 w-full h-full overflow-hidden [backface-visibility:hidden] ${roundedClass}`}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${roundedClass}`}
                    />
                  </div>
                  <div
                    className={`absolute inset-0 w-full h-full overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center ${roundedClass}`}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className={`w-full h-full object-cover opacity-90 ${roundedClass}`}
                    />
                  </div>
                </div>
              </div>
              <span
                className="mt-5 font-bold text-center text-lg tracking-wide transition-colors duration-300 group-hover:opacity-80"
                style={{ color: category.accent || "hsl(var(--info))" }}
              >
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

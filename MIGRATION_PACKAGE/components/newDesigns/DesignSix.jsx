"use client"

import React from "react";

const ShopByCollections = () => {
  const categories = [
    { name: "Cell Phones", image: "/images/designSix/Summer_Quilt_Banner.png", color: "text-[#68d1c8]" },
    { name: "Handbags", image: "/images/designSix/bathrobes.png", color: "text-[#e481e1]" },
    { name: "Stroller", image:  "/images/designSix/bathrobes.png", color: "text-gray-500" },
    { name: "Appliances", image:  "/images/designSix/Handmade_Rugs.png", color: "text-[#7ed957]" },
    { name: "Sofa & Chair", image:  "/images/designSix/Summer_Quilt_Banner.png", color: "text-[#68c8d1]" },
    { name: "Headphone", image: "/images/designSix/Summer_Quilt_Banner.png", color: "text-[#ffd700]" },
    { name: "Cosmetics", image:  "/images/designSix/Handmade_Rugs.png", color: "text-[#ff69b4]" },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Shop By Collections</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden [perspective:1000px]">
              <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute w-full h-full ">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white flex items-center justify-center rounded-full">
                  {/* <span className={`text-lg font-semibold ${category.color}`}>{category.name}</span> */}
                  <div className="absolute w-full h-full ">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                </div>
              </div>
            </div>
            <span className={`mt-2 font-bold ${category.color}`}>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByCollections;


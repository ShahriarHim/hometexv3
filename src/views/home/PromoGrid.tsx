import { promoTiles } from "@/data/migration-content";
import Link from "next/link";

export const PromoGrid = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-0">
      {/* First Grid */}
      <div className="bg-info/75 border border-solid border-gray-300 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center">
        <div className="w-full h-full">
          <img
            src={promoTiles[0]?.image || "/images/22L.png"}
            alt="Promo"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-1/2 mx-4 whitespace-nowrap text-center">
          <h2 className="text-2xl font-bold mb-2 font-kaushan">
            {promoTiles[0]?.title || "Clothes"}
          </h2>
          <p className="text-text-primary bg-primary-light px-2 rounded">
            {promoTiles[0]?.badge || "save to 40% off"}
          </p>
          <p className="text-gray-700 mt-2 text-3xl">{promoTiles[0]?.subtitle || "Big Discount"}</p>
          <Link
            href="/products"
            className="rounded bg-transparent border border-gray-600 text-gray-600 px-5 py-2 mt-5 hover:bg-gray-600 inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
      {/* Second Grid */}
      <div className="bg-error p-4 border border-solid border-gray-300 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 flex flex-col items-center">
        <div className="text-center m-8">
          <h2 className="text-1xl font-bold mb-2">{promoTiles[1]?.title || "End Of Season"}</h2>
          <p className="text-5xl mb-4">SALE</p>
          <p className="text-lg mb-4 border px-3 text-gray-300">
            {promoTiles[1]?.badge || "Save to 50% off on First Order"}
          </p>
          <Link
            href="/products"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
      {/* Third Grid */}
      <div className="bg-primary-light border border-solid border-gray-300 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center">
        <div className="w-1/2 mx-4 whitespace-nowrap text-center">
          <h2 className="text-2xl font-bold mb-2 font-kaushan">
            {promoTiles[2]?.title || "Sunglasses"}
          </h2>
          <p className="text-text-primary bg-info/75 px-2 rounded">
            {promoTiles[2]?.badge || "Buy 1 get 1 Free"}
          </p>
          <p className="text-gray-700 text-3xl mt-2">{promoTiles[2]?.subtitle || "New Arrivals"}</p>
          <Link
            href="/products"
            className="rounded bg-transparent border border-gray-600 text-gray-600 px-5 py-2 mt-5 hover:bg-gray-600 inline-block"
          >
            Shop Now
          </Link>
        </div>
        <div className="w-full h-full">
          <img
            src={promoTiles[2]?.image || "/images/11L.png"}
            alt="Promo"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

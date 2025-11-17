import React from "react";

const DesignOne = () => {
  return (
    <div className="bg-[#d9614e42]">
      <div className="max-w-screen-xl mx-auto px-3 mb-5 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6  relative">
          <div className="p-4 mx-5">
          <div className="flex flex-row gap-3 items-center">
              <img src="/images/icons/i1.png" alt="" className="h-12" />
            <h2 className="text-xl font-bold mb-2">Your Search Ends Here!</h2>
            </div>
            <p>
              We believe in innovation, simplification, modernization, implementing something extraordinary that wasn&apos;t adopted before ...
            </p>
          </div>

          <div className="p-4 mx-5">
            <div className="flex flex-row gap-3 items-center">
              <img src="/images/icons/i2.png" alt="" className="h-12" />
              <h2 className="text-xl font-bold mb-2">Experience with us!</h2>
            </div>
            <p>
              We&apos;ll never let you down”-providing the most compelling shopping experience possible.
            </p>
          </div>

          <div className="p-4 mx-5 relative">
            <div className="flex flex-row gap-3 items-center">
              <img src="/images/icons/i3.png" alt="" className="h-12" />
              <h2 className="text-xl font-bold mb-2">Happiness; It's Global!</h2>
            </div>
            <p>
              We spread happiness throughout the world from Hometex Bangladesh. Get to know more from our Shipping & Delivery Page.
            </p>

            {/* Image like stamp or chop */}
            <div className="absolute bottom-0 right-0 -mb-24 md:-mb-12 mr-0 md:-mr-24">
              <img src="images/bestql.png" alt="Stamp" className="w-28 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignOne;

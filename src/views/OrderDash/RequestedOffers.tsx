"use client";

import React from "react";

export const RequestedOffers = () => {
  return (
    <div>
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Requested Offers List</h3>
        <p className="text-gray-600 mb-6">
          View all your requested offers
        </p>
        <div className="bg-gray-50 p-8 rounded-lg">
          <p className="text-gray-500">No requested offers found.</p>
        </div>
      </div>
    </div>
  );
};


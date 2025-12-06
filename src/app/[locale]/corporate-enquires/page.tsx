"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const CorporateEnquiries = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto bg-[url(/images/corporateenquiry/cibg.png)] bg-cover">
        <div>
          <img
            src="/images/corporateenquiry/ce.png"
            alt=""
            className="h-[450px] lg:h-[550px] float-right"
          />
        </div>
        <div className="clear-both"></div>
        <div className="flex flex-col justify-center items-center px-4 lg:px-0">
          <form action="" className="space-y-6 w-full max-w-4xl">
            <h1 className="text-4xl font-semibold py-5 text-center">Corporate Enquiry Form</h1>

            <div className="flex flex-col lg:flex-row gap-5 justify-center items-center">
              <input
                type="text"
                name="fName"
                placeholder="Full Name"
                className="form-input py-3 w-full lg:w-3/4 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <input
                type="text"
                name="cName"
                placeholder="Company Name"
                className="form-input py-3 w-full lg:w-3/4 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-5 justify-center items-center">
              <input
                type="number"
                name="contact"
                placeholder="Phone number"
                className="form-input py-3 w-full lg:w-3/4 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="form-input py-3 w-full lg:w-3/4 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-5 justify-center items-center">
              <input
                type="datetime-local"
                name="date"
                placeholder="Select Date & Time"
                className="form-input py-3 w-full lg:w-3/4 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="form-input py-3 w-full lg:w-3/4 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <textarea
              name="enquiry"
              id="enquiry"
              rows={5}
              className="form-textarea py-3 w-full border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Your Enquiry"
            ></textarea>

            <div className="text-center text-sm">
              <p>Note: Your phone number will be verified with OTP in the next step</p>
            </div>

            <div className="flex justify-center">
              <Link href="/corporate-details">
                <button className="form-button px-8 py-3 bg-pink-600 text-white hover:bg-pink-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
                  Submit
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CorporateEnquiries;

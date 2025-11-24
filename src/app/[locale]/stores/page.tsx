"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const Stores = () => {
  const router = useRouter();

  const handleShowDirections = () => {
    router.push('/travelOptions');
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-20">
        <div className="mb-10 relative" style={{ height: '30vh' }}>
          <iframe
            title="Hometex Bangladesh Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2074821299625!2d90.41235477602272!3d23.73997948917496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7785667deaf%3A0x126b0ec64bae353c!2sHometex%20Bangladesh!5e0!3m2!1sen!2sbd!4v1711826160291!5m2!1sen!2sbd"
            style={{
              border: 0,
              height: "100%",
              width: "100%",
              position: "absolute",
            }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <img
              src="/images/location/shantinagar.jpg"
              alt="Shantinagar Outlet"
              className="w-full md:w-1/3 rounded-lg"
              style={{ height: 'auto', maxWidth: '100%' }}
            />
            <div className="text-lg">
              <h2 className="text-xl font-bold mb-4">Shantinagar Outlet</h2>
              <p className="mb-2">Hometex Bangladesh Manufactory</p>
              <p className="mb-2">Store # 354-355, Level # 03, Twin Tower Concord Shopping Complex, 27 Chamelibag, Santinagar, Dhaka-1217</p>
              <p className="mb-2">Opened at: 10:30 AM - 8:30 PM</p>
              <p className="mb-2">Contact : <a href="tel:+8809610963839">+8809610963839</a></p>
              <button
                onClick={handleShowDirections}
                className="px-3 py-2 bg-blue-500 rounded-full text-white hover:scale-110"
              >
                Show Direction
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mt-5">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <img
              src="/images/location/gulshan.jpg"
              alt="Gulshan Outlet"
              className="w-full md:w-1/3 rounded-lg"
              style={{ height: 'auto', maxWidth: '100%' }}
            />
            <div className="text-lg">
              <h2 className="text-xl font-bold mb-4">Gulshan Outlet</h2>
              <p className="mb-2">Hometex Bangladesh Manufactory</p>
              <p className="mb-2">Store # 464, Level# 04, Police Plaza Concord Shopping Mall, Gulshan-01, Dhaka-1212</p>
              <p className="mb-2">Opened: 11:00 AM - 9:00 PM</p>
              <p className="mb-2">Contact : <a href="tel:+8809610963839">+8809610963839</a></p>
              <button
                onClick={handleShowDirections}
                className="px-3 py-2 bg-blue-500 rounded-full text-white hover:scale-110"
              >
                Show Direction
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mt-5">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <img
              src="/images/location/elephenroad.jpg"
              alt="Elephant Road Outlet"
              className="w-full md:w-1/3 rounded-lg"
              style={{ height: 'auto', maxWidth: '100%' }}
            />
            <div className="text-lg">
              <h2 className="text-xl font-bold mb-4">Elephant Road Outlet</h2>
              <p className="mb-2">Hometex Bangladesh Manufactory</p>
              <p className="mb-2">1st Floor, House # 307, S J Jahanara Imam Sharani, New Elephant Road, Dhaka-1205</p>
              <p className="mb-2">Opened: 11:00 AM - 9:00 PM</p>
              <p className="mb-2">Contact : <a href="tel:+8809610963839">+8809610963839</a></p>
              <button
                onClick={handleShowDirections}
                className="px-3 py-2 bg-blue-500 rounded-full text-white hover:scale-110"
              >
                Show Direction
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Stores;


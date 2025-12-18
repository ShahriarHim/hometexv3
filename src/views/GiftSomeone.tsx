"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import React, { useState } from "react";

interface Combo {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
}

const GiftSomeone: React.FC = () => {
  const [isGiftCard, setIsGiftCard] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<Combo["id"]>(1);

  const combos: Combo[] = [
    {
      id: 1,
      name: "Luxury Towel Combo",
      price: "BDT 2,500",
      description: "Set of 4 premium quality towels",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 2,
      name: "Bedding Essentials Combo",
      price: "BDT 3,500",
      description: "Complete bedding set with pillow covers",
      image:
        "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 3,
      name: "Bathroom Luxury Set",
      price: "BDT 4,000",
      description: "Premium bathroom accessories set",
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 4,
      name: "Home Textile Bundle",
      price: "BDT 5,000",
      description: "Complete home textile collection",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-pink-300 bg-opacity-30">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:pl-[100px] md:pt-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-64 h-12 bg-[#f0f0f0] rounded-full p-1 flex items-center shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
                  <div
                    className={`absolute h-10 w-32 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 transition-transform duration-300 ease-in-out shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.1)] ${
                      isGiftCard ? "translate-x-0" : "translate-x-[128px]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setIsGiftCard(true)}
                    className={`flex-1 h-full flex items-center justify-center z-10 transition-colors duration-300 font-medium ${
                      isGiftCard ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Gift Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGiftCard(false)}
                    className={`flex-1 h-full flex items-center justify-center z-10 transition-colors duration-300 font-medium ${
                      !isGiftCard ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Gift Product
                  </button>
                </div>
              </div>

              {isGiftCard ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-800">Digital Gift Card</h1>
                  <h5 className="pt-4 text-gray-600 font-medium">Choose a design</h5>
                  <div className="flex gap-3 pt-2 max-w-md">
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedImage === index ? "transform scale-110 shadow-lg" : ""
                        }`}
                      >
                        <img
                          src="/images/icons/gift-card.png"
                          alt=""
                          className={`h-24 rounded-lg transition-all duration-300 ${
                            selectedImage === index ? "ring-2 ring-pink-500" : ""
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-800">Gift Products</h1>
                  <h5 className="pt-4 text-gray-600 font-medium">Choose a combo</h5>
                  <div className="grid grid-cols-1 gap-4 pt-4 w-[80%]">
                    {combos.map((combo) => (
                      <div
                        key={combo.id}
                        onClick={() => setSelectedCombo(combo.id)}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedCombo === combo.id ? "transform scale-[1.02]" : ""
                        }`}
                      >
                        <div
                          className={`p-4 rounded-xl transition-all duration-300 ${
                            selectedCombo === combo.id
                              ? "bg-gradient-to-r from-pink-500/10 to-pink-600/10 shadow-lg"
                              : "bg-white/50 backdrop-blur-sm hover:bg-white/80"
                          }`}
                        >
                          <h3 className="text-lg font-semibold text-gray-800">{combo.name}</h3>
                          <p className="text-pink-600 font-medium mt-1">{combo.price}</p>
                          <p className="text-gray-600 text-sm mt-1">{combo.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex flex-col pt-6">
                <label htmlFor="remail" className="text-gray-700 font-medium mb-2">
                  Who&apos;s the lucky recipient?
                </label>
                <div className="relative w-[80%]">
                  <input
                    type="email"
                    name="remail"
                    placeholder="Recipient email"
                    className="w-full py-3.5 px-4 bg-white/50 backdrop-blur-sm border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-pink-600/10 -z-10 blur-sm" />
                </div>
              </div>

              {isGiftCard && (
                <div className="pt-6">
                  <h5 className="text-gray-700 font-medium mb-2">Choose a card value</h5>
                  <div className="flex flex-wrap items-center gap-3 md:w-[80%] mt-2">
                    {[500, 1000, 1500, 2000, 2500, 3000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setSelectedAmount(amount)}
                        className={`px-5 py-2.5 rounded-xl border-0 transition-all duration-300 font-medium ${
                          selectedAmount === amount
                            ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                            : "bg-white/50 backdrop-blur-sm text-gray-600 hover:bg-white/80"
                        }`}
                      >
                        BDT {amount}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col pt-6">
                <label htmlFor="gmessage" className="text-gray-700 font-medium mb-2">
                  Gift message (optional)
                </label>
                <div className="relative w-[80%]">
                  <textarea
                    rows={4}
                    name="gmessage"
                    placeholder="Add a personal note"
                    className="w-full py-3.5 px-4 bg-white/50 backdrop-blur-sm border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/20 outline-none transition-all duration-300 placeholder-gray-400 resize-none"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-pink-600/10 -z-10 blur-sm" />
                </div>
              </div>

              <div className="flex flex-col pt-6">
                <label className="text-gray-700 font-medium mb-2">
                  When should we send the Gift Card?
                </label>
                <div className="flex flex-row items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sendToday"
                      name="sendTime"
                      value="today"
                      className="w-5 h-5 text-pink-500 focus:ring-pink-500/20 border-gray-300"
                    />
                    <label htmlFor="sendToday" className="ml-2 text-gray-600">
                      Today
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sendNow"
                      name="sendTime"
                      value="now"
                      className="w-5 h-5 text-pink-500 focus:ring-pink-500/20 border-gray-300"
                    />
                    <label htmlFor="sendNow" className="ml-2 text-gray-600">
                      Now
                    </label>
                  </div>
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="date"
                        id="customDate"
                        name="customDate"
                        className="px-4 py-2.5 bg-white/50 backdrop-blur-sm border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/20 outline-none transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-pink-600/10 -z-10 blur-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col pt-6">
                <label htmlFor="sName" className="text-gray-700 font-medium mb-2">
                  Who is it from?
                </label>
                <div className="relative w-[80%]">
                  <input
                    type="text"
                    name="sName"
                    placeholder="Sender's name"
                    className="w-full py-3.5 px-4 bg-white/50 backdrop-blur-sm border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/20 outline-none transition-all duration-300 placeholder-gray-400"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-pink-600/10 -z-10 blur-sm" />
                </div>
              </div>

              <div className="flex flex-col pt-6 w-[80%]">
                <button
                  type="button"
                  className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium hover:from-pink-600 hover:to-pink-700"
                >
                  Buy now
                </button>
                <p className="text-center pt-3 text-gray-600">
                  Delivery by email, this gift card never expires
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className="relative w-full h-full flex justify-center items-center bg-white/20 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
                <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-md" />
                {isGiftCard ? (
                  <img
                    src="/images/icons/gift-card.png"
                    alt=""
                    className="relative z-10 transform transition-all duration-500 ease-in-out h-64 w-64 object-contain"
                    style={{
                      transform: selectedImage !== null ? "scale(1.7)" : "scale(1)",
                      opacity: selectedImage !== null ? 1 : 0.5,
                      filter:
                        selectedImage !== null
                          ? "drop-shadow(0 15px 10px rgba(0, 0, 0, 0.2))"
                          : "none",
                    }}
                  />
                ) : (
                  <img
                    src={
                      selectedCombo
                        ? combos.find((combo) => combo.id === selectedCombo)?.image
                        : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1153&q=80"
                    }
                    alt=""
                    className="relative z-10 transform transition-all duration-500 ease-in-out h-64 w-64 object-cover rounded-lg"
                    style={{
                      transform: selectedCombo !== null ? "scale(1.7)" : "scale(1)",
                      opacity: selectedCombo !== null ? 1 : 0.5,
                      filter:
                        selectedCombo !== null
                          ? "drop-shadow(0 15px 10px rgba(0, 0, 0, 0.2))"
                          : "none",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiftSomeone;

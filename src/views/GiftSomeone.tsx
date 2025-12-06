"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface Combo {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
}

const GiftSomeone = () => {
  const [isGiftCard, setIsGiftCard] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedCombo, setSelectedCombo] = useState(1);
  const [sendTime, setSendTime] = useState("now");
  const [customDate, setCustomDate] = useState("");

  const [formData, setFormData] = useState({
    recipientEmail: "",
    giftMessage: "",
    senderName: "",
  });

  const combos: Combo[] = [
    {
      id: 1,
      name: "Luxury Towel Combo",
      price: "BDT 2,500",
      description: "Set of 4 premium quality towels",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 2,
      name: "Bedding Essentials Combo",
      price: "BDT 3,500",
      description: "Complete bedding set with pillow covers",
      image:
        "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 3,
      name: "Bathroom Luxury Set",
      price: "BDT 4,000",
      description: "Premium bathroom accessories set",
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 4,
      name: "Home Textile Bundle",
      price: "BDT 5,000",
      description: "Complete home textile collection",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isGiftCard && !selectedAmount) {
      toast.error("Please select a gift card amount");
      return;
    }

    toast.success(
      isGiftCard
        ? `Gift card of ${selectedAmount} BDT sent successfully!`
        : "Gift product sent successfully!"
    );

    // Reset form
    setFormData({ recipientEmail: "", giftMessage: "", senderName: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Section - Form */}
            <div className="space-y-6">
              {/* Toggle Switch */}
              <div className="flex items-center justify-center">
                <div className="relative w-72 h-14 bg-gray-100 rounded-full p-1 flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                  <div
                    className={`absolute h-12 w-36 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 transition-transform duration-300 ease-in-out shadow-lg ${
                      isGiftCard ? "translate-x-0" : "translate-x-[140px]"
                    }`}
                  />
                  <button
                    onClick={() => setIsGiftCard(true)}
                    className={`flex-1 h-full flex items-center justify-center z-10 transition-colors duration-300 font-semibold text-base ${
                      isGiftCard ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Gift Card
                  </button>
                  <button
                    onClick={() => setIsGiftCard(false)}
                    className={`flex-1 h-full flex items-center justify-center z-10 transition-colors duration-300 font-semibold text-base ${
                      !isGiftCard ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Gift Product
                  </button>
                </div>
              </div>

              {/* Content Based on Selection */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                {isGiftCard ? (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Digital Gift Card</h1>
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-gray-700 font-semibold mb-3">Choose a design</h5>
                        <div className="flex gap-4">
                          {[0, 1, 2].map((index) => (
                            <div
                              key={index}
                              onClick={() => setSelectedImage(index)}
                              className={`cursor-pointer transition-all duration-300 ${
                                selectedImage === index
                                  ? "transform scale-110 ring-4 ring-pink-500 rounded-lg"
                                  : "hover:scale-105"
                              }`}
                            >
                              <img
                                src="/images/icons/gift-card.png"
                                alt={`Gift card design ${index + 1}`}
                                className="h-24 w-auto rounded-lg shadow-md"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Gift Products</h1>
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-gray-700 font-semibold mb-3">Choose a combo</h5>
                        <div className="space-y-3">
                          {combos.map((combo) => (
                            <div
                              key={combo.id}
                              onClick={() => setSelectedCombo(combo.id)}
                              className={`cursor-pointer transition-all duration-300 ${
                                selectedCombo === combo.id
                                  ? "transform scale-[1.02]"
                                  : "hover:scale-[1.01]"
                              }`}
                            >
                              <div
                                className={`p-4 rounded-xl transition-all duration-300 ${
                                  selectedCombo === combo.id
                                    ? "bg-gradient-to-r from-pink-500/10 to-pink-600/10 shadow-lg ring-2 ring-pink-500"
                                    : "bg-white/60 hover:bg-white/90 shadow-md"
                                }`}
                              >
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {combo.name}
                                </h3>
                                <p className="text-pink-600 font-medium mt-1">{combo.price}</p>
                                <p className="text-gray-600 text-sm mt-1">{combo.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                  {/* Recipient Email */}
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail" className="text-gray-700 font-semibold">
                      Who&apos;s the lucky recipient?
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="Recipient email"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                      className="h-12 bg-white/70 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  {/* Gift Card Amount Selection */}
                  {isGiftCard && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-semibold">Choose a card value</Label>
                      <div className="flex flex-wrap gap-3">
                        {[500, 1000, 1500, 2000, 2500, 3000].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setSelectedAmount(amount)}
                            className={`px-5 py-3 rounded-xl transition-all duration-300 font-semibold ${
                              selectedAmount === amount
                                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30 scale-105"
                                : "bg-white/70 text-gray-700 hover:bg-white shadow-md hover:shadow-lg"
                            }`}
                          >
                            BDT {amount}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gift Message */}
                  <div className="space-y-2">
                    <Label htmlFor="giftMessage" className="text-gray-700 font-semibold">
                      Gift message (optional)
                    </Label>
                    <Textarea
                      id="giftMessage"
                      rows={4}
                      placeholder="Add a personal note"
                      value={formData.giftMessage}
                      onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
                      className="bg-white/70 border-gray-200 focus:border-pink-500 focus:ring-pink-500 resize-none"
                    />
                  </div>

                  {/* Send Time */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">
                      When should we send the Gift Card?
                    </Label>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sendTime"
                          value="today"
                          checked={sendTime === "today"}
                          onChange={(e) => setSendTime(e.target.value)}
                          className="w-4 h-4 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-gray-700">Today</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sendTime"
                          value="now"
                          checked={sendTime === "now"}
                          onChange={(e) => setSendTime(e.target.value)}
                          className="w-4 h-4 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-gray-700">Now</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="sendTime"
                          value="custom"
                          checked={sendTime === "custom"}
                          onChange={(e) => setSendTime(e.target.value)}
                          className="w-4 h-4 text-pink-500 focus:ring-pink-500"
                        />
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => {
                            setCustomDate(e.target.value);
                            setSendTime("custom");
                          }}
                          className="px-4 py-2 bg-white/70 border border-gray-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 outline-none"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Sender Name */}
                  <div className="space-y-2">
                    <Label htmlFor="senderName" className="text-gray-700 font-semibold">
                      Who is it from?
                    </Label>
                    <Input
                      id="senderName"
                      type="text"
                      placeholder="Sender's name"
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      className="h-12 bg-white/70 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="space-y-3 pt-4">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Buy now
                    </Button>
                    <p className="text-center text-gray-600 text-sm">
                      Delivery by email, this gift card never expires
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Section - Preview */}
            <div className="flex justify-center items-start lg:sticky lg:top-24 h-fit">
              <div className="relative w-full max-w-lg bg-white/30 backdrop-blur-xl rounded-2xl p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl backdrop-blur-md"></div>
                <div className="relative z-10 flex justify-center items-center min-h-[400px]">
                  {isGiftCard ? (
                    <img
                      src="/images/icons/gift-card.png"
                      alt="Gift card preview"
                      className="transform transition-all duration-500 ease-in-out object-contain"
                      style={{
                        width: selectedImage !== null ? "380px" : "280px",
                        height: "auto",
                        opacity: selectedImage !== null ? 1 : 0.5,
                        filter:
                          selectedImage !== null
                            ? "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))"
                            : "none",
                      }}
                    />
                  ) : (
                    <img
                      src={combos.find((c) => c.id === selectedCombo)?.image}
                      alt="Product combo preview"
                      className="transform transition-all duration-500 ease-in-out rounded-xl object-cover"
                      style={{
                        width: selectedCombo !== null ? "380px" : "280px",
                        height: selectedCombo !== null ? "380px" : "280px",
                        opacity: selectedCombo !== null ? 1 : 0.5,
                        filter:
                          selectedCombo !== null
                            ? "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))"
                            : "none",
                      }}
                    />
                  )}
                </div>
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

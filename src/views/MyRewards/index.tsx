"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Reward {
  id: number;
  title: string;
  points: number;
  description: string;
  image?: string;
  expiryDate?: string;
}

export default function MyRewardsView() {
  const { user: _user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    // Mock data - Replace with actual API call
    setUserPoints(1250);
    setRewards([
      {
        id: 1,
        title: "10% Off Voucher",
        points: 500,
        description: "Get 10% off your next purchase",
        expiryDate: "2025-12-31",
      },
      {
        id: 2,
        title: "Free Shipping",
        points: 300,
        description: "Free shipping on orders over $50",
        expiryDate: "2025-12-31",
      },
      {
        id: 3,
        title: "20% Off Voucher",
        points: 1000,
        description: "Get 20% off your next purchase",
        expiryDate: "2025-12-31",
      },
    ]);
    setLoading(false);
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Rewards</h1>
          <p className="text-gray-600">Redeem your points for exclusive rewards</p>
        </div>

        {/* Points Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Available Points</p>
              <p className="text-4xl font-bold">{userPoints.toLocaleString()}</p>
            </div>
            <div className="text-6xl opacity-20">🎁</div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Reward Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏆</span>
              </div>

              {/* Reward Info */}
              <h3 className="text-xl font-semibold mb-2">{reward.title}</h3>
              <p className="text-gray-600 mb-4">{reward.description}</p>

              {/* Points Required */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Points Required</span>
                <span className="text-lg font-bold text-blue-600">
                  {reward.points.toLocaleString()}
                </span>
              </div>

              {/* Expiry Date */}
              {reward.expiryDate && (
                <p className="text-xs text-gray-400 mb-4">
                  Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                </p>
              )}

              {/* Redeem Button */}
              <button
                onClick={() => {
                  if (userPoints >= reward.points) {
                    alert(`Redeeming ${reward.title}...`);
                    // Add actual redemption logic here
                  } else {
                    alert("Not enough points!");
                  }
                }}
                disabled={userPoints < reward.points}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  userPoints >= reward.points
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {userPoints >= reward.points ? "Redeem" : "Not Enough Points"}
              </button>
            </div>
          ))}
        </div>

        {/* How to Earn Points Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h3 className="font-semibold mb-1">Make Purchases</h3>
                <p className="text-sm text-gray-600">Earn 1 point for every $1 spent</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✍️</span>
              <div>
                <h3 className="font-semibold mb-1">Write Reviews</h3>
                <p className="text-sm text-gray-600">Earn 50 points per review</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎂</span>
              <div>
                <h3 className="font-semibold mb-1">Birthday Bonus</h3>
                <p className="text-sm text-gray-600">Get 200 points on your birthday</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

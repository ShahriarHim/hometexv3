"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeView } from "@/views/Home";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HomeView />
      <Footer />
    </div>
  );
};

export default HomePage;

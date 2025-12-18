"use client";

import { CustomerSatisfactionModal } from "@/components/CustomerSatisfactionModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const Footer = () => {
  const t = useTranslations("footer");
  const [isSatisfactionModalOpen, setIsSatisfactionModalOpen] = useState(false);

  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("aboutUs")}</h3>
            <p className="text-muted-foreground text-sm mb-4">{t("aboutDescription")}</p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("shopAll")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/bedding"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("beddingCollection")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/bath"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("bathEssentials")}
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("corporateSolutions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("customerService")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("shippingPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("returnPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("termsConditions")}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsSatisfactionModalOpen(true)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {t("customerSatisfaction")}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("getInTouch")}</h3>
            <ul className="space-y-3 text-sm mb-4">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{t("address")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{t("phone")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{t("email")}</span>
              </li>
            </ul>
            <div>
              <p className="text-sm mb-2 font-medium">{t("newsletter")}</p>
              <div className="flex space-x-2" suppressHydrationWarning>
                <Input type="email" placeholder={t("emailPlaceholder")} className="flex-1" />
                <Button size="sm">{t("subscribeButton")}</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>{t("copyright")}</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                {t("termsConditions")}
              </Link>
              <Link href="/sitemap" className="hover:text-primary transition-colors">
                {t("sitemap")}
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Cards */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">We accept:</span>
            <div className="flex flex-wrap items-center gap-3">
              {/* Visa */}
              <div className="h-10 w-14 bg-white rounded border border-border/50 flex items-center justify-center shadow-sm hover:shadow transition-shadow">
                <svg
                  viewBox="0 0 84 47"
                  className="h-6 w-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35.6 9.3h-5.8l-3.6 28.3h5.8l3.6-28.3zm18.2 17.6c0-6.8-9.4-7.2-9.3-10.3 0-.9.9-1.9 2.8-2.1 1-.1 3.6-.2 6.5 1l1.2-5.5c-1.6-.6-4-1.1-6.8-1.1-7.2 0-12.2 3.8-12.3 9.3 0 4 3.6 6.3 6.3 7.6 2.8 1.3 3.8 2.1 3.8 3.3 0 1.8-2.3 2.6-4.5 2.6-3.8 0-6-1-7.8-1.7l-1.2 5.7c1.8.8 5.1 1.5 8.7 1.5 7.6 0 12.6-3.8 12.7-9.7zm19.1-17.6l-4.5 28.3h5.5l4.5-28.3h-5.5zm11.2 0l-3.5 19.8-1.6-9.2c-.3-1-.9-1.9-1.8-2.4l-3.1 13.8h-5.7l5.3-28.3h5.5l1.8 9.8 4.8-9.8h5.2z"
                    fill="#1434CB"
                  />
                </svg>
              </div>
              {/* Mastercard */}
              <div className="h-10 w-14 bg-white rounded border border-border/50 flex items-center justify-center shadow-sm hover:shadow transition-shadow">
                <img
                  src="/images/icons/mastercard.png"
                  alt="Mastercard"
                  className="h-6 w-auto object-contain"
                />
              </div>
              {/* American Express */}
              <div className="h-10 w-14 bg-white rounded border border-border/50 flex items-center justify-center shadow-sm hover:shadow transition-shadow">
                <svg
                  viewBox="0 0 100 30"
                  className="h-5 w-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="30" rx="2" fill="#006FCF" />
                  <text
                    x="50"
                    y="20"
                    textAnchor="middle"
                    fontSize="10"
                    fill="white"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                  >
                    AMEX
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomerSatisfactionModal
        isOpen={isSatisfactionModalOpen}
        onClose={() => setIsSatisfactionModalOpen(false)}
      />
    </footer>
  );
};

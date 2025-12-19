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
      </div>

      <CustomerSatisfactionModal
        isOpen={isSatisfactionModalOpen}
        onClose={() => setIsSatisfactionModalOpen(false)}
      />
    </footer>
  );
};

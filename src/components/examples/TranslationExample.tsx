"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Example component demonstrating how to use translations with next-intl
 * 
 * This component shows:
 * 1. Basic translation usage with useTranslations hook
 * 2. Accessing nested translation keys
 * 3. Using translations in different parts of the component
 */
export default function TranslationExample() {
  // Load translations from different namespaces
  const t = useTranslations("common");
  const tHero = useTranslations("hero");
  const tProducts = useTranslations("products");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("welcome")}</CardTitle>
        <CardDescription>{tHero("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{tHero("title")}</h3>
          <p className="text-muted-foreground">{tHero("subtitle")}</p>
        </div>

        <div className="flex gap-2">
          <Button>{tHero("shopNow")}</Button>
          <Button variant="outline">{tHero("learnMore")}</Button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">{tProducts("featured")}</h4>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full">
              {tProducts("addToCart")}
            </Button>
            <Button variant="outline" className="w-full">
              {tProducts("addToWishlist")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * USAGE IN SERVER COMPONENTS:
 * 
 * For server components, use getTranslations instead:
 * 
 * import { getTranslations } from 'next-intl/server';
 * 
 * export default async function ServerComponent() {
 *   const t = await getTranslations('common');
 *   return <h1>{t('welcome')}</h1>;
 * }
 * 
 * USAGE IN METADATA:
 * 
 * import { getTranslations } from 'next-intl/server';
 * 
 * export async function generateMetadata() {
 *   const t = await getTranslations('metadata');
 *   return {
 *     title: t('title'),
 *     description: t('description'),
 *   };
 * }
 */


"use client";

import { Link } from "@/i18n/routing";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  text: string;
}

export const CustomerFeedbackSection = () => {
  const t = useTranslations("customerSatisfaction");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      skipSnaps: false,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: t("testimonial1.name"),
      role: t("testimonial1.role"),
      avatar: "/images/testimonials/avatar1.jpg",
      text: t("testimonial1.text"),
    },
    {
      id: "2",
      name: t("testimonial2.name"),
      role: t("testimonial2.role"),
      avatar: "/images/testimonials/avatar2.jpg",
      text: t("testimonial2.text"),
    },
    {
      id: "3",
      name: t("testimonial3.name"),
      role: t("testimonial3.role"),
      avatar: "/images/testimonials/avatar3.jpg",
      text: t("testimonial3.text"),
    },
    {
      id: "4",
      name: t("testimonial4.name"),
      role: t("testimonial4.role"),
      avatar: "/images/testimonials/avatar4.jpg",
      text: t("testimonial4.text"),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left Section - Metrics */}
            <div className="lg:col-span-2 bg-primary p-8 lg:p-12 rounded-2xl text-primary-foreground">
              <div className="space-y-6">
                <div>
                  <h2 className="text-5xl lg:text-6xl font-bold mb-2">{t("metricValue")}</h2>
                  <p className="text-lg lg:text-xl font-semibold uppercase tracking-wide opacity-90">
                    {t("metricLabel")}
                  </p>
                </div>
                <p className="text-base lg:text-lg opacity-90 leading-relaxed">
                  {t("supportingText")}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary mt-4"
                  asChild
                >
                  <Link href="/products">{t("primaryAction")}</Link>
                </Button>
              </div>
            </div>

            {/* Right Section - Testimonials Carousel */}
            <div className="lg:col-span-3 p-8 lg:p-12 bg-card rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-foreground">{t("testimonialsTitle")}</h3>

              <div className="relative flex-1 min-h-[300px]">
                <div className="overflow-hidden -ml-4" ref={emblaRef}>
                  <div className="flex gap-4">
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="flex-[0_0_calc(85%-1rem)] sm:flex-[0_0_calc(75%-1rem)] lg:flex-[0_0_calc(70%-1rem)] min-w-0 pl-4"
                      >
                        <div className="bg-white rounded-xl p-6 shadow-lg h-full flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {testimonial.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                          </div>
                          <blockquote className="text-muted-foreground leading-relaxed flex-1 italic">
                            &ldquo;{testimonial.text}&rdquo;
                          </blockquote>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Navigation */}
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => emblaApi?.scrollTo(index)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        index === selectedIndex
                          ? "w-8 bg-primary"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

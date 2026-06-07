"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full overflow-x-hidden pt-36 md:pt-48 pb-10">
      <div className="container mx-auto px-4 space-y-6 text-center">
        <div className="space-y-6 mx-auto max-w-5xl">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
            Find the Career That
            <br />
            Matches Your Profile
          </h1>
          <p className="mx-auto max-w-[680px] text-muted-foreground md:text-xl px-2">
            Career Match AI suggests the most suitable career paths for you by
            analyzing your academic qualifications and skills — then compares
            your profile with similar candidates using AI to deliver
            personalized recommendations.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 px-2">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Career Suggestions
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline" className="px-8">
              See How It Works
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0 max-w-5xl mx-auto w-full">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Career recommendation dashboard preview"
              className="w-full h-auto max-w-full rounded-lg shadow-2xl border mx-auto"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

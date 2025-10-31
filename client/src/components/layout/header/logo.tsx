import Image from "next/image";
import React from "react";

type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, string> = {
  // sm: mobil bazası 80px, yuxarılar mərhələli
  sm: "w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-44 4xl:w-52",
  // md: mobil bazası 96px (bir az iri), yuxarılar daha iri
  md: "w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 2xl:w-48 4xl:w-56",
  // lg: mobil bazası 112px (çox iri), showcase üçün
  lg: "w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44 2xl:w-52 4xl:w-60",
};

interface LogoProps {
  className?: string;
  size?: Size;
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = SIZE_MAP[size];

  return (
    <div className={`relative z-[52] ${sizeClasses} aspect-[3/1] ${className}`}>
      <Image
        alt="Jet Academy logo"
        src="/logos/jetlogo.png"
        fill
        sizes="(max-width:640px) 96px, (max-width:768px) 128px, (max-width:1024px) 144px, 160px"
        className="object-contain"
        priority
      />
    </div>
  );
}

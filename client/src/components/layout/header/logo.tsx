// src/components/logo.tsx
import Image from "next/image";
import React from "react";

interface LogoProps {

  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`relative z-[52]${className}`}>
      <Image
        alt="Logo of Jet School"
        src="/logos/jetlogo.png"
        width={300}
        height={100}
        className="object-fill"
        priority
      />
    </div>
  );
}

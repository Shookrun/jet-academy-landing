// src/components/logo.tsx
import Image from "next/image";
import React from "react";

interface LogoProps {

  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`relative z-[52] w-48 h-10 ${className}`}>
      <Image
        alt="Logo of Jet School"
        src="/logos/JET_School_Yellowww.png"
        fill
        className="object-fill"
        priority
      />
    </div>
  );
}

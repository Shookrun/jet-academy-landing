/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { motion } from "framer-motion";
import useCircles from "@/hooks/useCircles";

const Particle = ({
  size = 4,
  left,
  top,
  delay = 0,
  color,
}: {
  size?: number;
  left: number;
  top: number;
  delay: number;
  color: string;
}) => (
  <motion.div
    className={`absolute -z-[1] rounded-full`}
    style={{
      width: size,
      height: size,
      left: `${left}%`,
      top: `${top}%`,
      backgroundColor: color,
    }}
    animate={{
      opacity: [0.3, 0.4, 0.3],
      scale: [1, 1.2, 1],
      y: [-100, 100, -100],
    }}
    transition={{
      duration: 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function TopCircle() {
  const colors = ["#ff6161", "#ffb366", "#61ccff", "#54017d"];

  const { circles } = useCircles();
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    size: Math.random() * 4 + 6,
    left: Math.random() * 120,
    top: Math.random() * 120,
    delay: Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <>
      <motion.div
        className="xl:w-[700px] blur-[70px] -z-10 xl:h-[700px] bg-jsyellow md:-top-[20%] -top-[10%] w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] rounded-full absolute lg:-left-[50%] lg:-top-[50%] xl:-left-[10%] xl:-top-[60%] opacity-50"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
     <motion.div
  className="
    w-[300px] hidden sm:block h-[300px] bg-jsyellow
    xl:w-[700px] blur-[70px] xl:h-[700px] rounded-full
    absolute md:top-[60%] md:-right-6 lg:-right-[40%] -z-[1]
    md: lg:top-[60%] lg:hidden opacity-50
    2xl:hidden
  "
  animate={{
    scale: [1, 1.4, 1],
    opacity: [0.6, 0.2, 0.6],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>


      {circles && (
        <div className="fixed inset-0 pointer-events-none">
          {particles.map((particle, index) => (
            <Particle
              key={index}
              size={particle.size}
              left={particle.left}
              top={particle.top}
              delay={particle.delay}
              color={particle.color}
            />
          ))}
        </div>
      )}
    </>
  );
}

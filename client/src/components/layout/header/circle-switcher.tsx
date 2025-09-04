"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface CircleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function CircleSwitch({
  checked,
  onChange,
  className,
}: CircleSwitchProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onChange(!checked)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-14 h-7 rounded-full flex items-center cursor-pointer transition-all duration-200",
        checked ? "bg-jsblack/10" : "hover:bg-jsblack/10 bg-white",
        "border border-gray-300",
        className
      )}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -10, x: "-50%" }}
            className="absolute text-xs bg-black text-white px-2 py-1 rounded-md -bottom-10 left-1/2 "
          >
            Particles
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch dot */}
      <motion.div
        initial={false}
        animate={{
          x: checked ? 28 : 5,
          y: "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="absolute top-1/2 w-5 h-5 rounded-full bg-orange-500"
      />
    </div>
  );
}

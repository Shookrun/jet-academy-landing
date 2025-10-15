"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";

function ScrollItems() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2], // Input range
    [0, 0, 1.1] // Output range
  );

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      ref={ref}
      className="fixed flex gap-3 bottom-6 right-6 z-50"
      style={{ opacity }}
    >
      <Link
        href={`https://wa.me/+994509836699?text=${encodeURIComponent(
          ""
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center h-12 w-12 rounded-full bg-[#1560bd] hover:bg-[#1580cd] shadow-lg transition-all"
      >
        <FaWhatsapp className="h-6 w-6 text-white" />
      </Link>

      <div className="relative">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90"
          width="52"
          height="52"
          viewBox="0 0 52 52"
        >
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            stroke="#FFE38B"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            stroke="#121212"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            style={{
              pathLength,
              opacity: 0.4,
            }}
            strokeDasharray="0 1"
          />
        </svg>

        <button
          onClick={scrollToTop}
          className="flex items-center relative z-40 justify-center h-12 w-12 rounded-full bg-[#1560bd] hover:bg-[#1580cd] shadow-lg transition-all"
        >
          <FaArrowUp className="h-6 w-6 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

export default ScrollItems;

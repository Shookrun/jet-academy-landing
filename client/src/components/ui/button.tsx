"use client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import React from "react";
import type { IconType } from "react-icons";

interface IButton {
  text?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  onClick?: () => void;
  icon?: IconType | React.ReactElement;
  iconSize?: number;
  iconPosition?: "left" | "right";
  className?: string;
  fontWeight?: "normal" | "bold" | "semibold" | "extrabold";
}

export default function Button({
  text,
  variant = "primary",
  type = "button",
  icon: Icon,
  className,
  iconPosition = "left",
  iconSize = 16,
  fontWeight = "semibold",
  onClick,
}: IButton) {
  const renderIcon = () => {
    if (!Icon) return null;

    if (React.isValidElement(Icon)) {
      return Icon;
    }

    if (typeof Icon === "function") {
      return <Icon size={iconSize} />;
    }

    return null;
  };

  return (
    <button
      className={cn(
        variant === "primary" &&
          "bg-jsyellow hover:bg-white border hover:border-jsyellow hover:text-jsyellow text-white hover:opacity-70",
        variant === "secondary" && "bg-white text-jsyellow hover:bg-gray-50",
        "py-3 px-8 rounded-[30px]",
        "flex items-center transition-all duration-300 justify-center gap-2",
        iconPosition === "right" && "flex-row-reverse",
        fontWeight === "normal" && "font-normal",
        fontWeight === "bold" && "font-bold",
        fontWeight === "semibold" && "font-semibold",
        fontWeight === "extrabold" && "font-extrabold",
        className,
        "w-fit"
      )}
      onClick={onClick}
      type={type}
    >
      <motion.div
        whileHover={{
          rotate: [0, -10, 10, -10, 0],
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
      >
        {renderIcon()}
      </motion.div>
      {text && (
        <motion.span
          whileHover={{
            y: [-1, 1, -1],
            transition: {
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {text}
        </motion.span>
      )}
    </button>
  );
}

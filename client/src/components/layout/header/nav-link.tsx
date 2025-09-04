"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface INavLink {
  title: string;
  href: string;
  items?: INavLink[];
  noHover?: boolean;
  isActive?: boolean;
  className?: string;
  handleClick?: () => void;
}

export default function NavLink({
  title,
  href,
  className,
  items,
  isActive,
  handleClick,
  noHover = false,
}: INavLink) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!items || items.length === 0) {
    return (
      <Link
        href={href}
        className={cn(
          "transition-all duration-300 relative group hover:text-jsyellow",
          isActive ? "text-jsyellow" : "text-jsblack",
          className
        )}
        onClick={handleClick}
      >
        {title}
        {!noHover && (
          <span className="absolute left-0 right-0 -bottom-1 h-[1px] bg-jsyellow transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
        )}
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 transition-all duration-300 hover:text-jsyellow focus:outline-none",
          className
        )}
      >
        {title}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-1"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="lg:absolute lg:left-0 lg:top-10 lg:mt-2 lg:w-56 lg:rounded-md lg:shadow-lg lg:bg-white z-10 overflow-hidden"
          >
            <div className="py-1 lg:border lg:border-gray-100 rounded-md">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-jsyellow transition-colors",
                    item.className
                  )}
                  onClick={() => {
                    setIsOpen(false);
                    if (handleClick) handleClick();
                    if (item.handleClick) item.handleClick();
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

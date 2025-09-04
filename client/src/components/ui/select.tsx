import React, { useEffect, useRef, useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useOnClickOutside } from "@/hooks/useClickOutside";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  label?: string;
  description?: string;
  error?: FieldError | string;
  value?: string | number;
  registration?: Partial<UseFormRegisterReturn>;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
  maxVisibleOptions?: number; 
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      value,
      onChange,
      placeholder = "Select an option",
      className = "",
      registration,
      maxHeight = "200px",
      maxVisibleOptions = 6, 
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(
      options.find((opt) => opt.value === value) || null
    );
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const highlightedOptionRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(selectRef, () => setIsOpen(false));

    const errorMessage = error
      ? typeof error === "string"
        ? error
        : error.message
      : undefined;

    useEffect(() => {
      if (value) {
        const option = options.find((opt) => opt.value === value);
        if (option) setSelectedOption(option);
      }
    }, [value, options]);

    useEffect(() => {
      if (highlightedOptionRef.current && isOpen) {
        highlightedOptionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [highlightedIndex, isOpen]);

    const handleSelect = (option: Option) => {
      setSelectedOption(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
      if (onChange) onChange(option.value);
      if (registration?.onChange) {
        const event = {
          target: { value: option.value, name: registration.name },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        registration.onChange(event);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (
        !isOpen &&
        (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")
      ) {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev <= 0 ? options.length - 1 : prev - 1
          );
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev >= options.length - 1 ? 0 : prev + 1
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex]);
          }
          break;
      }
    };

 
    const calculateMaxHeight = () => {
      if (typeof window === 'undefined') return maxHeight;
      
      const viewportHeight = window.innerHeight;
      const optionHeight = 48; 
      const maxOptionsToShow = Math.min(maxVisibleOptions, Math.floor((viewportHeight * 0.4) / optionHeight));
      
      return `${maxOptionsToShow * optionHeight}px`;
    };

    return (
      <motion.div
        className="flex flex-col gap-2 w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        ref={ref}
      >
      


        <div className="relative" ref={selectRef}>
          <motion.div
            tabIndex={0}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label}
            className={`
              w-full
              px-6
              py-4
              bg-[#fef7eb]
              border
              border-jsyellow
              rounded-[32px]
              text-jsblack
              font-semibold
              outline-none
              cursor-pointer
              flex
              justify-between
              items-center
              transition-all
              duration-300
              ease-in-out
              hover:shadow-md
              focus:ring-2
              focus:ring-jsyellow/50
              focus:ring-offset-2
              [@media(min-width:3500px)]:!text-3xl
              ${errorMessage ? "border-red-500 bg-red-50" : ""}
              ${className}
            `}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className={!selectedOption ? "text-gray-400 [@media(min-width:3500px)]:!text-3xl" : "[@media(min-width:3500px)]:!text-3xl"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <MdKeyboardArrowDown className="w-6 h-6 [@media(min-width:3500px)]:!w-10 [@media(min-width:3500px)]:!h-10 text-jsyellow" />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={optionsRef}
                role="listbox"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute z-50 w-full mt-2 bg-white border border-jsyellow rounded-[24px] overflow-hidden shadow-xl"
                style={{
                  maxHeight: calculateMaxHeight(),
                }}
              >
                <div 
                  className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-jsyellow/30 scrollbar-track-transparent hover:scrollbar-thumb-jsyellow/50"
                  style={{
                    maxHeight: calculateMaxHeight(),
                  }}
                >
                  {options.map((option, index) => (
                    <motion.div
                      key={option.value}
                      ref={highlightedIndex === index ? highlightedOptionRef : null}
                      role="option"
                      aria-selected={selectedOption?.value === option.value}
                      className={`
                        px-4 sm:px-6 
                        py-3 
                        cursor-pointer 
                        transition-all
                        duration-200
                        text-sm sm:text-base
                        [@media(min-width:3500px)]:!text-3xl
                        [@media(min-width:3500px)]:!py-4
                        border-b border-gray-100 last:border-b-0
                        ${
                          highlightedIndex === index
                            ? "bg-jsyellow/20 text-jsblack font-medium"
                            : "hover:bg-[#fef7eb] text-gray-700"
                        }
                        ${
                          selectedOption?.value === option.value
                            ? "bg-jsyellow/10 font-semibold text-jsblack"
                            : ""
                        }
                      `}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      whileHover={{ 
                        backgroundColor: highlightedIndex === index ? "rgba(245, 158, 11, 0.2)" : "#fef7eb",
                        x: 2
                      }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{option.label}</span>
                        {selectedOption?.value === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 [@media(min-width:3500px)]:!w-6 [@media(min-width:3500px)]:!h-6 bg-jsyellow rounded-full flex items-center justify-center ml-2 flex-shrink-0"
                          >
                            <svg className="w-2.5 h-2.5 [@media(min-width:3500px)]:!w-4 [@media(min-width:3500px)]:!h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Scroll indicator */}
                {options.length > maxVisibleOptions && (
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-80" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {errorMessage && (
          <motion.span 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm [@media(min-width:3500px)]:!text-xl text-red-500 pl-2"
          >
            {errorMessage}
          </motion.span>
        )}
      </motion.div>
    );
  }
);

Select.displayName = "Select";

export default Select;
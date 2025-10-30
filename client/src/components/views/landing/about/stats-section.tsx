"use client";
import { motion } from "framer-motion";

interface StatsProps {
  stats: {
    graduatesLabel: string;
    groupsLabel: string;
    studentsLabel: string;
    teachingArea: string;
  };
}

export default function StatsSection({ stats }: StatsProps) {
  const statsData = [
    { value: "10+", label: stats.teachingArea },
    { value: "1500+", label: stats.graduatesLabel },
    { value: "20+", label: stats.groupsLabel },
    { value: "200+", label: stats.studentsLabel },
  ];

  return (
    <section
      className="
        container
        max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] 
        3xl:max-w-[2200px] 4xl:max-w-[2600px] [@media(min-width:3500px)]:max-w-[3200px]
        mx-auto
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 4xl:px-32
        py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 2xl:py-24 3xl:py-28 4xl:py-32
        [@media(min-width:3500px)]:py-40
      "
    >
      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
          gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 3xl:gap-20 4xl:gap-24
          [@media(min-width:3500px)]:gap-28
        "
      >
        {statsData.map(({ value, label }, index) => (
          <motion.div
            key={index}
            className="
              relative
              flex flex-col items-center justify-center
              text-center
              p-5 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 3xl:p-14 4xl:p-16
              [@media(min-width:3500px)]:p-20
              bg-[#fef7eb] hover:bg-[#fef3e0]
              rounded-2xl sm:rounded-3xl lg:rounded-[28px] xl:rounded-[32px] 2xl:rounded-[36px]
              3xl:rounded-[40px] 4xl:rounded-[48px] [@media(min-width:3500px)]:rounded-[56px]
              border border-jsyellow hover:border-orange-400
              min-h-[140px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] 
              xl:min-h-[200px] 2xl:min-h-[240px] 3xl:min-h-[280px] 4xl:min-h-[320px]
              [@media(min-width:3500px)]:min-h-[400px]
              transition-all duration-300 ease-out
              shadow-sm hover:shadow-lg
              group
            "
            whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
          >
            {/* VALUE — yalnız mobile böyük */}
            <motion.h3
              className="
                text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                2xl:text-6xl 3xl:text-7xl 4xl:text-8xl
                [@media(min-width:3500px)]:text-9xl
                font-bold text-jsyellow group-hover:text-orange-500
                mb-2 sm:mb-2 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6
                [@media(min-width:3500px)]:mb-8
                transition-colors duration-300
                leading-none
              "
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.h3>

            {/* LABEL — yalnız mobile bir pillə böyük */}
            <p
              className="
                text-base sm:text-sm md:text-base lg:text-lg xl:text-xl 
                2xl:text-2xl 3xl:text-3xl 4xl:text-4xl
                [@media(min-width:3500px)]:text-5xl
                text-gray-700 group-hover:text-gray-800
                font-medium
                transition-colors duration-300
                leading-snug
                max-w-[220px] sm:max-w-[250px] md:max-w-[300px] 
                lg:max-w-none
              "
            >
              {label}
            </p>

            <div
              className="
                absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5
                w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5
                [@media(min-width:3500px)]:w-8 [@media(min-width:3500px)]:h-8
                bg-jsyellow/20 group-hover:bg-orange-400/30
                rounded-full
                transition-colors duration-300
              "
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

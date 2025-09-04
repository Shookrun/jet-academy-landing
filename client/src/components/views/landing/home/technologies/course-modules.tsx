"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaCloud, FaCode, FaShieldAlt } from "react-icons/fa";

const moduleTypes = [
  { id: "starter", icon: FaCloud },
  { id: "programmer", icon: FaCode },
  { id: "hacker", icon: FaShieldAlt },
];

const CourseModules = () => {
  const t = useTranslations("courses");

  const renderModuleIcon = (moduleId: string) => {
    const moduleType = moduleTypes.find((type) => type.id === moduleId);
    const Icon = moduleType?.icon || FaCloud;
    return (
      <motion.div
        className="bg-jsyellow text-white p-2 rounded-full"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 relative">
        {moduleTypes.map((moduleType) => {
          const moduleId = moduleType.id;
          const moduleSubKeys = Object.keys(t.raw(`${moduleId}.modules`));

          return (
            <div key={moduleId} className="w-full select-none cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                {renderModuleIcon(moduleId)}
                <motion.h2
                  className="font-semibold select-none pointer-events-none text-[28px] text-jsblack"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {t(`${moduleId}.title`)}
                </motion.h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleSubKeys.map((subKey, index) => (
                  <motion.div
                    key={subKey}
                    className="border border-jsyellow rounded-[32px] p-6 bg-[#fef7eb] text-jsblack"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.5,
                      },
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 4px 15px rgba(252,174,30,0.15)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="flex flex-col gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="font-semibold text-xl">
                        {t(`${moduleId}.modules.${subKey}.title`)}
                      </h3>
                      <p className="text-gray-600">
                        {t(`${moduleId}.modules.${subKey}.description`)}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <motion.span
                          className="text-sm bg-jsyellow/10 px-3 py-1 rounded-full"
                          whileHover={{
                            backgroundColor: "rgba(252,174,30,0.2)",
                            transition: { duration: 0.2 },
                          }}
                        >
                          {t(`${moduleId}.modules.${subKey}.duration`)}
                        </motion.span>
                        <motion.span
                          className="text-sm bg-jsyellow/10 px-3 py-1 rounded-full"
                          whileHover={{
                            backgroundColor: "rgba(252,174,30,0.2)",
                            transition: { duration: 0.2 },
                          }}
                        >
                          {t(`${moduleId}.modules.${subKey}.level`)}
                        </motion.span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseModules;

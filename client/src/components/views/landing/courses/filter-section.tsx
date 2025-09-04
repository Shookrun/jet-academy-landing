"use client";

import { Dispatch, SetStateAction } from 'react';
import { Locale } from "@/i18n/request";

interface FilterOptions {
  levels: string[];
  durations: number[];
  tags: string[];
}

interface ActiveFilters {
  levels: string[];
  durations: number[];
  tags: string[];
}

interface FilterTranslations {
  filters: string;
  level: string;
  duration: string;
  tags: string;
  resetFilters: string;
}

interface FilterSectionProps {
  filters: FilterOptions;
  activeFilters: ActiveFilters;
  setActiveFilters: Dispatch<SetStateAction<ActiveFilters>>;
  setFilterOpen: Dispatch<SetStateAction<boolean>>;
  locale: Locale;
  translations: FilterTranslations;
}

export default function FilterSection({ 
  filters, 
  activeFilters, 
  setActiveFilters, 
  setFilterOpen, 
  locale,
  translations
}: FilterSectionProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {translations.filters}
        </h3>
        <button 
          onClick={() => setFilterOpen(false)}
          className="text-gray-500 md:hidden"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Level filter */}
        {filters.levels.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">
              {translations.level}
            </h4>
            <div className="space-y-2">
              {filters.levels.map((level, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`level-${idx}`}
                    checked={activeFilters.levels.includes(level)}
                    onChange={() => {
                      const newLevels = activeFilters.levels.includes(level)
                        ? activeFilters.levels.filter(l => l !== level)
                        : [...activeFilters.levels, level];
                      setActiveFilters({...activeFilters, levels: newLevels});
                    }}
                    className="w-4 h-4 text-jsyellow border-gray-300 rounded focus:ring-jsyellow"
                  />
                  <label htmlFor={`level-${idx}`} className="ml-2 text-sm text-gray-700">
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Duration filter */}
        {filters.durations.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">
              {translations.duration}
            </h4>
            <div className="space-y-2">
              {filters.durations.map((duration, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`duration-${idx}`}
                    checked={activeFilters.durations.includes(duration)}
                    onChange={() => {
                      const newDurations = activeFilters.durations.includes(duration)
                        ? activeFilters.durations.filter(d => d !== duration)
                        : [...activeFilters.durations, duration];
                      setActiveFilters({...activeFilters, durations: newDurations});
                    }}
                    className="w-4 h-4 text-jsyellow border-gray-300 rounded focus:ring-jsyellow"
                  />
                  <label htmlFor={`duration-${idx}`} className="ml-2 text-sm text-gray-700">
                    {duration} {locale === "az" ? "ay" : "месяцев"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
       
        
        {/* Clear filters button */}
        <button
          onClick={() => setActiveFilters({ levels: [], durations: [], tags: [] })}
          className="w-full px-4 py-2 mt-4 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
        >
          {translations.resetFilters}
        </button>
      </div>
    </div>
  );
}
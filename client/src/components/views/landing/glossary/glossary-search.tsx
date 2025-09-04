"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

interface GlossarySearchProps {
  placeholderText: string;
  initialQuery?: string;
}

export default function GlossarySearch({
  placeholderText,
  initialQuery = "",
}: GlossarySearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/glossary/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholderText}
          className="w-full px-6 py-4 pr-12 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-jsyellow/50 transition-all"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-jsblack"
        >
          <FiSearch size={20} />
        </button>
      </form>
    </div>
  );
}

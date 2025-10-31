"use client";
import { useEffect } from "react";
import { useProjectModal } from "@/hooks/useProjectModal";
import React from "react";
import { MdClose } from "react-icons/md";

export default function ProjectModal() {
  const { isOpen, toggle, link } = useProjectModal();

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const videoId = url.match(/(?:\/|v=)([a-zA-Z0-9_-]{11})(?:\?|&|$)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Səhifə skrolunu kilidlə (modal açıqkən)
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[999] p-4
        grid place-items-center
        h-[100dvh] bg-jsblack/60 backdrop-blur-[2px]
      "
      onClick={() => toggle()} // backdrop-a klik → bağla
      role="dialog"
      aria-modal="true"
      aria-label="Project video"
    >
      <div
        className="relative w-[92vw] max-w-[900px] bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // içəri klik → bağlanmasın
      >
        {/* Close */}
        <button
          onClick={() => toggle()}
          className="absolute top-2 right-2 md:top-3 md:right-3 z-10
                     rounded-full bg-blue-600 text-white w-8 h-8
                     grid place-items-center shadow-lg
                     mt-[env(safe-area-inset-top)]"
          aria-label="Close"
        >
          <MdClose className="text-xl" />
        </button>

        {/* Video 16:9 */}
        <div className="relative w-full aspect-video">
          {link && (
            <iframe
              src={getEmbedUrl(link)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}

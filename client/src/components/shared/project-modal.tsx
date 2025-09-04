"use client";
import { useProjectModal } from "@/hooks/useProjectModal";
import React from "react";
import { MdClose } from "react-icons/md";
import Button from "../ui/button";

export default function ProjectModal() {
  const { isOpen, toggle, link } = useProjectModal();

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const videoId = url.match(/(?:\/|v=)([a-zA-Z0-9_-]{11})(?:\?|&|$)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed h-full w-full z-[999] flex items-end md:items-center justify-center inset-0 bg-jsblack/20">
      <div className="rounded-t-2xl rounded-b-none md:rounded-b-2xl flex flex-col gap-2 md:gap-4 max-w-[800px] w-full bg-white p-4 md:p-5">
        <div className="flex items-center justify-end">
          <Button
            variant="primary"
            className="px-3 md:px-3"
            icon={<MdClose className="text-base md:text-xl" />}
            onClick={() => toggle()}
          />
        </div>

        {link && (
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={getEmbedUrl(link)}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}

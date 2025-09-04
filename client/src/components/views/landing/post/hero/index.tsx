import { PostType, EventStatus } from "@/types/enums";
import { getLocale } from "next-intl/server";
import Image from "next/image";

interface PostHeroProps {
  title: string;
  type: string;
  date: string;
  eventDate?: string;
  eventStatus?: EventStatus;
  content: string;
  tags: string[];
  imageUrl?: string;
  dateText: string;
  eventDateText: string;
  tagsText: string;
}

export default async function PostHero({
  title,
  type,
  date,
  eventDate,
  eventStatus,
  content,
  tags,
  imageUrl,
  dateText,
  eventDateText,
  tagsText,
}: PostHeroProps) {
  const locale = await getLocale();

  const getEventStatusName = (status?: EventStatus) => {
    if (!status) return null;

    switch (status) {
      case EventStatus.UPCOMING:
        return locale === "az" ? "Gələcək" : "Предстоящий";
      case EventStatus.PAST:
        return locale === "az" ? "Keçmiş" : "Прошедший";
      case EventStatus.ONGOING:
        return locale === "az" ? "Davam edir" : "Активная";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-wrap items-center gap-4">
        <span
          className={`px-4 py-2 rounded-full capitalize ${
            type === PostType.BLOG
              ? "bg-blue-100 text-blue-800"
              : type === PostType.NEWS
              ? "bg-green-100 text-green-800"
              : "bg-jsyellow/10 text-jsblack"
          }`}
        >
          {type}
        </span>

        <span className="bg-jsyellow/10 text-jsblack px-4 py-2 rounded-full">
          {`${dateText}: ${date}`}
        </span>

        {eventDate && (
          <span className="bg-jsyellow/10 text-jsblack px-4 py-2 rounded-full">
            {`${eventDateText}: ${eventDate}`}
          </span>
        )}

        {eventStatus && (
          <span
            className={`px-4 py-2 rounded-full capitalize ${
              eventStatus === EventStatus.UPCOMING
                ? "bg-jsyellow/10 text-jsblack"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {getEventStatusName(eventStatus)}
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold leading-[1.3] text-jsblack">
        {title}
      </h1>

      {imageUrl && (
        <div className="w-full relative overflow-hidden mt-10 rounded-[32px] aspect-[16/9]">
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/` + imageUrl}
            alt={title}
            fill
            quality={100}
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      )}

      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="text-gray-600 prose max-w-none prose-headings:text-jsblack prose-li:list-disc prose-li:ml-4"
      ></div>


      {tags && tags.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">{tagsText}:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-jsyellow/10 text-jsblack px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

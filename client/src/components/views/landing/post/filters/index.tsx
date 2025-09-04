import { PostType } from "@/types/enums";
import Link from "next/link";
import { MdEvent, MdFeed, MdOutlineFeed, MdPercent } from "react-icons/md";

interface PostFiltersProps {
  type?: PostType;
  t: any;
}

export default function PostFilters({ type, t }: PostFiltersProps) {
  const filterItems = [
    {
      href: "/news",
      label: t("allPosts"),
      icon: null,
      isActive: !type,
    },
    {
      href: "/news/category/news",
      label: t("news"),
      icon: <MdFeed className="text-lg" />,
      isActive: type?.toUpperCase() === PostType.NEWS,
    },
    {
      href: "/news/category/event",
      label: t("event"),
      icon: <MdEvent className="text-lg" />,
      isActive: type?.toUpperCase() === PostType.EVENT,
    },
    {
      href: "/news/category/offers",
      label: t("offers"),
      icon: <MdPercent className="text-lg" />,
      isActive: type?.toUpperCase() === PostType.OFFERS,
    },
    {
      href: "/blog",
      label: t("blog"),
      icon: <MdOutlineFeed className="text-lg" />,
      isActive: type?.toUpperCase() === PostType.BLOG,
    },
  ];

  return (
    <div className="w-full px-4 mb-10">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {filterItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`px-4 py-3 rounded-xl font-medium transition-all text-center flex items-center justify-center gap-2 ${
                item.isActive
                  ? "bg-jsyellow text-white shadow-md"
                  : "bg-jsyellow/10 text-jsblack hover:bg-jsyellow/20"
              }`}
            >
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

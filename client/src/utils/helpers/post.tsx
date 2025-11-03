import { PostType } from "@/types/enums";
import { MdArticle, MdEvent, MdFeed } from "react-icons/md";

export const getPostTypeIcon = (postType: PostType) => {
  switch (postType) {
    case PostType.BLOG:
      return <MdArticle className="w-5 h-5" />;
    case PostType.NEWS:
      return <MdFeed className="w-5 h-5" />;
    case PostType.EVENT:
      return <MdEvent className="w-5 h-5" />;
    default:
      return null;
  }
};

export const getPostTypeName = (postType: PostType, t: any) => {
  switch (postType) {
    case PostType.BLOG:
      return t("blog");
    case PostType.NEWS:
      return t("news");
    case PostType.EVENT:
      return t("event");
    default:
      return postType;
  }
};

export const getTextContent = (content: any, locale: string) => {
  let textContent = "";
  try {
    if (typeof content[locale] === "string") {
      textContent = content[locale].replace(/<[^>]*>/g, "");
    } else if (content[locale]?.["content[az]"]) {
      textContent =
        locale === "az"
          ? content[locale]["content[az]"]
          : content[locale]["content[en]"];
    }
  } catch (error) {
    console.error("Error parsing content:", error);
    textContent = "";
  }

  return textContent;
};

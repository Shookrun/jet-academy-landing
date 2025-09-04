// src/components/views/landing/home/blogs.tsx
import SectionTitle from "@/components/shared/section-title";
import Button from "@/components/ui/button";
import { PostType } from "@/types/enums";
import { getAllPosts } from "@/utils/api/post";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";
import PostsSlider from "./slider";

export default async function Blogs() {
  try {
    const t = await getTranslations("blogs");
    const posts = await getAllPosts({
      page: 1,
      limit: 5,
      type: PostType.BLOG,
      includeBlogs: true,
    });
    if (!posts) return null;

    return (
      <div
        id="blogs"
        className="
          container mx-auto
          px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
          2xl:px-0 3xl:px-24 4xl:px-32
          my-20 4xl:my-24
          flex flex-col gap-8 4xl:gap-12
        "
      >
        <SectionTitle title={t("title")} description={t("description")} />

        <div>
          <PostsSlider data={posts} />
        </div>

        <Link href="/news">
          <Button
            iconPosition="right"
            className="items-center mx-auto py-3 [@media(min-width:3500px)]:!text-2xl px-6 4xl:py-4 4xl:px-8"
            icon={<MdArrowRightAlt size={24} className="[@media(min-width:3500px)]:!w-12 [@media(min-width:3500px)]:!h-12" />}
            text={t("seeAll")}
          />
        </Link>
      </div>
    );
  } catch (error) {
    console.error("Blogs component error:", error);
    return null;
  }
}

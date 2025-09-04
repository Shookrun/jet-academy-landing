/* eslint-disable @typescript-eslint/no-explicit-any */

export const getNavLinks = (t: any) => {
  return [
    {
      title: t("home"),
      href: "/",
    },
    {
      title: t("about"),
      href: "/about-us",
    },

    {
      title: t("courses"),
      href: "/courses",
    },
    {
      title: t("offers"),
      href: "/news/category/offers",
    },

    {
      title: t("useful"),
      href: "#",
      items: [
        {
          title: t("blog"),
          href: "/blog",
        },
        {
          title: t("news"),
          href: "/news",
        },
        {
          title: t("gallery"),
          href: "/gallery",
        },
        {
          title: t("media"),
          href: "/projects",
        },
        {
          title: t("glossary"),
          href: "/glossary/terms",
        },
      ],
    },

    {
      title: t("contact"),
      href: "/contact-us",
    },
  ];
};

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface AboutPoint {
  title: string;
  description: string;
  position: "fixed" | "sticky";
  top: string;
}

export const getAboutPoints = (t: any) => {
  return [
    {
      title: t("points.interactive.title"),
      description: t("points.interactive.description"),
      position: "fixed",
      top: "25",
    },
    {
      title: t("points.experienced.title"),
      description: t("points.experienced.description"),
      position: "fixed",
      top: "100",
    },
    {
      title: t("points.individual.title"),
      description: t("points.individual.description"),
      position: "fixed",
      top: "175",
    },
    {
      title: t("points.future.title"),
      description: t("points.future.description"),
      position: "sticky",
      top: "300",
    },
  ];
};

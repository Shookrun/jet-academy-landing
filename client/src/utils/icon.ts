import * as Fa from "react-icons/fa";
import * as Fi from "react-icons/fi";
import * as Bi from "react-icons/bi";
import * as Hi from "react-icons/hi";
import * as Ri from "react-icons/ri";
import * as Md from "react-icons/md";
import * as Bs from "react-icons/bs";
import * as Lu from "react-icons/lu";
import * as Ai from "react-icons/ai";
import { IconType } from "react-icons";

const iconLibraries = {
  Fa,
  Fi,
  Bi,
  Hi,
  Ri,
  Md,
  Bs,
  Lu,
  Ai,
};

export const getIcon = (iconName: string): IconType => {
  if (!iconName) return Ri.RiQuestionLine;

  const prefix = iconName.slice(0, 2).toLowerCase();

  const library = Object.entries(iconLibraries).find(
    ([key]) => key.toLowerCase() === prefix
  )?.[1];

  if (library && iconName in library) {
    return library[iconName as keyof typeof library];
  }

  return Ri.RiQuestionLine;
};

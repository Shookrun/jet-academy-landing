import { Role } from "@/types/enums";
import { Session } from "next-auth";
import {
  MdBook,
  MdDashboard,
  MdOutlineMessage,
  MdPeople,
  MdPeopleAlt,
  MdSettings,
  MdPhoto,
  MdVideoChat,
  MdShield,
  MdViewModule,
  MdPostAdd,
  MdLightbulbOutline,
} from "react-icons/md";

export interface MenuItem {
  name: string;
  icon: JSX.Element;
  path: string;
}

export function getMenuItems(session: Session | null): MenuItem[] {
  const baseMenuItemsStart: MenuItem[] = [
    {
      name: "İdarə paneli",
      icon: <MdDashboard size={24} />,
      path: "/dashboard",
    },
  ];

  const staffMenuItems: MenuItem[] = [
    {
      name: "Tələbə Layihələri",
      icon: <MdBook size={24} />,
      path: "/dashboard/student-projects",
    },
    {
      name: "Sorğular",
      icon: <MdOutlineMessage size={24} />,
      path: "/dashboard/requests",
    },
    // exams
    {
      name: "İmtahanlar",
      icon: <MdBook size={24} />,
      path: "/dashboard/exams",
    },
  ];

  const adminMenuItems: MenuItem[] = [
    {
      name: "İstifadəçilər",
      icon: <MdPeople size={24} />,
      path: "/dashboard/users",
    },
    {
      name: "Komanda",
      icon: <MdPeopleAlt size={24} />,
      path: "/dashboard/team",
    },
    {
      name: "Əlaqə məlumatları",
      icon: <MdOutlineMessage size={24} />,
      path: "/dashboard/contact-info",
    },
    {
      name: "Tələbə Layihələri",
      icon: <MdBook size={24} />,
      path: "/dashboard/student-projects",
    },
    {
      name: "Kurslar",
      icon: <MdVideoChat size={24} />,
      path: "/dashboard/courses",
    },
    {
      name: "Postlar",
      icon: <MdPostAdd size={24} />,
      path: "/dashboard/posts",
    },
    {
      name: "Tələblər",
      icon: <MdShield size={24} />,
      path: "/dashboard/eligibilities",
    },
    {
      name: "Modullar",
      icon: <MdViewModule size={24} />,
      path: "/dashboard/modules",
    },
    {
      name: "Sorğular",
      icon: <MdOutlineMessage size={24} />,
      path: "/dashboard/requests",
    },
    {
      name: "Qalereya",
      icon: <MdPhoto size={24} />,
      path: "/dashboard/gallery",
    },
    {
      name: "İmtahanlar",
      icon: <MdBook size={24} />,
      path: "/dashboard/exams",
    },
    {
      name: "Lügət",
      icon: <MdLightbulbOutline size={24} />,
      path: "/dashboard/glossary",
    },
  ];

  const CRMOperatorMenuItems: MenuItem[] = [
    {
      name: "Sorğular",
      icon: <MdOutlineMessage size={24} />,
      path: "/dashboard/requests",
    },
    {
      name: "İmtahanlar",
      icon: <MdBook size={24} />,
      path: "/dashboard/exams",
    },
  ];

  const contentManagerMenuItems: MenuItem[] = [
    {
      name:"Kurslar",
      icon: <MdVideoChat size={24} />,
      path: "/dashboard/courses",
    },

    {
      name: "Tələbə Layihələri",
      icon: <MdBook size={24} />,
      path: "/dashboard/student-projects",
    },
    {
      name:"Xəbərlər",
      icon: <MdPostAdd size={24} />,
      path: "/dashboard/posts",
    },
    {
      name: "Qalereya",
      icon: <MdPhoto size={24} />,
      path: "/dashboard/gallery",
    },
    {
      name:"Müəllimlər",
      icon: <MdPeople size={24} />,
      path: "/dashboard/team",
    },
    {
      name: "Lügət",
      icon: <MdLightbulbOutline size={24} />,
      path: "/dashboard/glossary",
    },
  ];

  const baseMenuItemsEnd: MenuItem[] = [
    {
      name: "Parametrlər",
      icon: <MdSettings size={24} />,
      path: "/dashboard/settings",
    },
  ];

  return [
    ...baseMenuItemsStart,
    ...(session?.user?.role === Role.ADMIN ? adminMenuItems : []),
    ...(session?.user?.role === Role.CRMOPERATOR ? CRMOperatorMenuItems : []),
    ...(session?.user?.role === Role.CONTENTMANAGER
      ? contentManagerMenuItems
      : []),
    ...(session?.user?.role === Role.STAFF ? staffMenuItems : []),
    ...baseMenuItemsEnd,
  ];
}

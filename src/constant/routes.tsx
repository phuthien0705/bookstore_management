import {
  FilledAuthor,
  FilledBook,
  FilledCategory,
  FilledSetting,
  FilledStaff,
} from "@/components/icons/filled";
import {
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  ChartPieIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const icon = {
  className: "w-5 h-5 text-inherit",
};
export const routes = [
  {
    title: "Dashboard",
    layout: "dashboard",
    pages: [
      {
        icon: <FilledBook {...icon} />,
        name: "Book",
        path: "/book",
      },
      {
        icon: <FilledAuthor {...icon} />,
        name: "Author",
        path: "/author",
      },
      {
        icon: <FilledCategory {...icon} />,
        name: "Category",
        path: "/category",
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
      },
    ],
  },
  {
    title: "Setting",
    layout: "setting",
    pages: [
      {
        icon: <FilledSetting {...icon} />,
        name: "config",
        path: "/config",
      },
      {
        icon: <FilledStaff {...icon} />,
        name: "staff",
        path: "/staff",
      },
    ],
  },
];

export const navbarRoutes = [
  {
    name: "dashboard",
    path: "/dashboard/home",
    icon: ChartPieIcon,
  },
  {
    name: "profile",
    path: "/dashboard/home",
    icon: UserIcon,
  },
  {
    name: "sign up",
    path: "/auth/sign-up",
    icon: UserPlusIcon,
  },
  {
    name: "sign in",
    path: "/auth/sign-in",
    icon: ArrowRightOnRectangleIcon,
  },
];

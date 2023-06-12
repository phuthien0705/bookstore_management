import {
  FilledAuthor,
  FilledBook,
  FilledCategory,
  FilledDownSquare,
  FilledSetting,
  FilledStaff,
} from "@/components/icons/filled";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
} from "@heroicons/react/24/solid";

const icon = {
  className: "w-5 h-5 text-inherit",
};
export const routes = [
  {
    title: "Chức năng",
    layout: "chuc-nang",
    pages: [
      {
        icon: <FilledDownSquare {...icon} />,
        name: "Phiếu nhập sách",
        path: "/phieu-nhap-sach",
      },
      {
        icon: <FilledBook {...icon} />,
        name: "Sách",
        path: "/sach",
      },
      {
        icon: <FilledAuthor {...icon} />,
        name: "Tác giả",
        path: "/tac-gia",
      },
      {
        icon: <FilledCategory {...icon} />,
        name: "Thể loại",
        path: "/the-loai",
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
    title: "Cài đặt",
    layout: "/cai-dat",
    pages: [
      {
        icon: <FilledSetting {...icon} />,
        name: "Tham chiếu",
        path: "/tham-chieu",
      },
      {
        icon: <FilledStaff {...icon} />,
        name: "Nhân viên",
        path: "/nhan-vien",
      },
    ],
  },
];

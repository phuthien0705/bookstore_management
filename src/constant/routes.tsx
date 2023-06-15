import {
  FilledAuthor,
  FilledBook,
  FilledCategory,
  FilledDownSquare,
  FilledSetting,
  FilledStaff,
  FilledTitle,
  FilledInvoice,
  FilledReceipt,
} from "@/components/icons/filled";

const icon = {
  className: "w-5 h-5 text-inherit",
};
export const managerRoutes = [
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
        icon: <FilledInvoice {...icon} />,
        name: "Lập hóa đơn",
        path: "/hoa-don",
      },
      {
        icon: <FilledReceipt {...icon} />,
        name: "Phiếu thu tiền",
        path: "/thu-tien",
      },
      {
        icon: <FilledTitle {...icon} />,
        name: "Đầu sách",
        path: "/dau-sach",
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
    ],
  },
  {
    title: "Cài đặt",
    layout: "cai-dat",
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
export const staffRoutes = [
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
        icon: <FilledInvoice {...icon} />,
        name: "Lập hóa đơn",
        path: "/hoa-don",
      },
      {
        icon: <FilledReceipt {...icon} />,
        name: "Phiếu thu tiền",
        path: "/thu-tien",
      },
      {
        icon: <FilledTitle {...icon} />,
        name: "Đầu sách",
        path: "/dau-sach",
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
    ],
  },
];

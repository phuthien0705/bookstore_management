import { useEffect, useState } from "react";
import {
  Dialog,
  Card,
  Typography,
  CardBody,
  Input,
  CardFooter,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { PHIEUNHAPSACH, type TACGIA } from "@prisma/client";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { api } from "@/utils/api";
import { contentMapping } from "@/constant/modal";
import { moneyFormat, parseMoneyFormat } from "@/utils/moneyFormat";


interface IBookEntryDetailModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentTicket: number;
}

const TABLE_HEAD = ["STT", "Tên sách", "Nhà xuất bản", "Năm xuất bản", "Số lượng", "Đơn giá nhập"]

const BookEntryDetailModal: React.FC<IBookEntryDetailModal> = ({
  open,
  handleOpen,
  currentTicket
}) => {

  const { data: bookEntryTicketList } = api.bookEntryTicket.getAll.useQuery({});

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[40rem]">
        <CardBody className="flex flex-col gap-4">
        <Typography className="text-2xl font-bold py-4 px-6 text-center">
          Chi tiết phiếu nhập sách
        </Typography>
          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-500 text-white">
              <tr>
                {TABLE_HEAD.map((head) => (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    {head}
                </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookEntryTicketList && bookEntryTicketList.map((bookEntryTicket) => (
                <tr
                  key={bookEntryTicket.MaPhieuNhapSach}
                  className="hover:bg-purple-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bookEntryTicket.MaPhieuNhapSach}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bookEntryTicket.NgayTao).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {moneyFormat(Number(bookEntryTicket.TongTien))} VND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bookEntryTicket.TaiKhoan.TenDangNhap}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <IconButton variant="text" color="gray">
                  <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
                    integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                    <i className="fas fa-eye"/>
                  </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </Dialog>
  );
};

export default BookEntryDetailModal;

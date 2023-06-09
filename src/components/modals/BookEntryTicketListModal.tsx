import { useState } from "react";
import {
  Dialog,
  Card,
  Typography,
  CardBody,
  IconButton,
} from "@material-tailwind/react";
import { api } from "@/utils/api";
import { moneyFormat } from "@/utils/moneyFormat";
import BookEntryDetailModal from "./BookEntryDetailModal";
import useModal from "@/hook/useModal";

interface IBookEntryTicketListModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
}

const BookEntryTicketListModal: React.FC<IBookEntryTicketListModal> = ({
  open,
  handleOpen,
}) => {
  const { data: bookEntryTicketList } = api.bookEntryTicket.getAll.useQuery({});
  const [currentTicket, setCurrentTicket] = useState(0);
  const {
    open: openBookEntryDetailModal,
    handleOpen: handleOpenBookEntryDetailModal,
  } = useModal();

  const handleViewBookEntryTicket = (index: number) => {
    setCurrentTicket(index);
    handleOpenBookEntryDetailModal(true); // Mở Modal
  };

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none rounded-lg"
    >
      <Card className="mx-auto w-full max-w-[60rem] max-h-[650px] overflow-scroll rounded-lg">
        <CardBody className="flex flex-col gap-4">
          <Typography className="px-6 py-4 text-center text-2xl font-bold">
            Danh sách phiếu nhập sách
          </Typography>
          <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg shadow-md">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Mã Phiếu Nhập Sách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Ngày Nhập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Thành Tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Tên tài khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookEntryTicketList &&
                bookEntryTicketList.map((bookEntryTicket) => (
                  <tr
                    key={bookEntryTicket.MaPhieuNhapSach}
                    className="transition-colors duration-200 hover:bg-purple-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      BOXO{bookEntryTicket.MaPhieuNhapSach}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(bookEntryTicket.NgayTao).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {moneyFormat(Number(bookEntryTicket.TongTien))} VND
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {bookEntryTicket.TaiKhoan.TenDangNhap}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <IconButton
                        variant="text"
                        color="gray"
                        onClick={() =>
                          handleViewBookEntryTicket(
                            bookEntryTicket.MaPhieuNhapSach
                          )
                        }
                      >
                        <link
                          rel="stylesheet"
                          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
                          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                        <i className="fas fa-eye" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <BookEntryDetailModal
        open={openBookEntryDetailModal}
        handleOpen={handleOpenBookEntryDetailModal}
        currentTicket={currentTicket}
      />
    </Dialog>
  );
};

export default BookEntryTicketListModal;

import {
  Dialog,
  Card,
  Typography,
  CardBody,
  Tooltip,
} from "@material-tailwind/react";
import { api } from "@/utils/api";
import { moneyFormat } from "@/utils/moneyFormat";

interface IBookEntryDetailModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentTicket: number;
}

const TABLE_HEAD = [
  "STT",
  "Tên sách",
  "Nhà xuất bản",
  "Năm xuất bản",
  "Số lượng",
  "Đơn giá nhập",
];

const BookEntryDetailModal: React.FC<IBookEntryDetailModal> = ({
  open,
  handleOpen,
  currentTicket,
}) => {
  const { data: bookEntryDetails } = api.bookEntryDetail.get.useQuery({
    MaPhieuNhapSach: currentTicket,
  });

  return (
    <Dialog
      size="lg"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full">
        <CardBody className="flex flex-col gap-4">
          <Typography className="px-6 py-4 text-center text-2xl font-bold">
            Chi tiết phiếu nhập sách
          </Typography>
          <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg shadow-md">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-500 text-white">
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookEntryDetails &&
                bookEntryDetails.map((bookEntryDetail, index) => (
                  <tr
                    key={bookEntryDetail.MaSach}
                    className="transition-colors duration-200 hover:bg-purple-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="max-w-[300px] truncate whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {bookEntryDetail.Sach.DauSach.TenDauSach}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {bookEntryDetail.Sach.NhaXuatBan}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {bookEntryDetail.Sach.NamXuatBan}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {bookEntryDetail.Sach.SoLuongTon}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {moneyFormat(Number(bookEntryDetail.DonGia))} VND
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

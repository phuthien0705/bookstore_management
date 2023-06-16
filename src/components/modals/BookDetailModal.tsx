import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Dialog, Card, Typography, CardBody } from "@material-tailwind/react";
import { api } from "@/utils/api";
import { type SACH } from "@prisma/client";
import { moneyFormat } from "@/utils/moneyFormat";

interface IBookDetailModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem: SACH | null;
  setCurrentItem: Dispatch<SetStateAction<SACH | null>>;
}

const BookDetailModal: React.FC<IBookDetailModal> = ({
  open,
  handleOpen,
  currentItem,
}) => {
  const [value, setValue] = useState<{
    MaSach: number;
    NhaXuatBan: string;
    NamXuatBan: string;
    DonGiaBan: number;
    SoLuongTon: number;
    MaDauSach: number;
  }>({
    MaSach: 0,
    NhaXuatBan: "",
    NamXuatBan: "",
    DonGiaBan: 0,
    SoLuongTon: 0,
    MaDauSach: 0,
  });
  const utils = api.useContext();
  const { data: titles } = api.title.getAll.useQuery({});
  const { data: authors } = api.author.getAll.useQuery();
  const getTitleNameById = (MaDauSach: number) => {
    const foundTitle = titles?.find((title) => title.MaDauSach === MaDauSach);
    return foundTitle ? foundTitle.TenDauSach : "";
  };
  const getCategoryNameById = (MaDauSach: number) => {
    const category = titles?.find((title) => title.MaDauSach === MaDauSach);
    return category ? category.TheLoai.TenTL : "";
  };
  useEffect(() => {
    if (currentItem) {
      setValue(
        currentItem as unknown as {
          MaSach: number;
          NhaXuatBan: string;
          NamXuatBan: string;
          DonGiaBan: number;
          SoLuongTon: number;
          MaDauSach: number;
        }
      );
    } else {
      setValue({
        MaSach: 0,
        NhaXuatBan: "",
        NamXuatBan: "",
        DonGiaBan: 0,
        SoLuongTon: 0,
        MaDauSach: 0,
      });
    }
  }, [currentItem]);

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full">
        <CardBody className="flex flex-col gap-4">
          <Typography className="text-lg font-bold">Chi tiết sách</Typography>
          <div className="flex flex-col gap-1">
            <div>
              <span className="font-semibold">ID: </span>
              <span>{value.MaSach}</span>
            </div>
            <div>
              <span className="font-semibold">Tên sách: </span>
              <span>{getTitleNameById(value.MaDauSach)}</span>
            </div>
            <div>
              <span className="font-semibold">Thể loại: </span>
              <span>{getCategoryNameById(value.MaDauSach)}</span>
            </div>
            <div>
              <span className="font-semibold">Tác giả: </span>
              <ul className="list-disc">
                {authors?.find((i) =>
                  i.CT_TACGIA.some((cttg) => cttg.MaDauSach)
                ) &&
                  authors
                    ?.filter((i) =>
                      i.CT_TACGIA.some(
                        (cttg) => cttg.MaDauSach === value.MaDauSach
                      )
                    )
                    ?.map((i) => (
                      <li className="ml-6" key={i.MaTG}>
                        {i.TenTG}
                      </li>
                    ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Giá: </span>
              <span>{moneyFormat(Number(value.DonGiaBan))}VNĐ</span>
            </div>
            <div>
              <span className="font-semibold">Số lượng tồn: </span>
              <span>{value.SoLuongTon} cuốn</span>
            </div>
            <div>
              <span className="font-semibold">Nhà xuất bản: </span>
              <span>{value.NhaXuatBan}</span>
            </div>
            <div>
              <span className="font-semibold">Năm xuất bản: </span>
              <span>{value.NamXuatBan}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Dialog>
  );
};

export default BookDetailModal;

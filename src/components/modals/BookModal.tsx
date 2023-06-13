import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  Card,
  Typography,
  CardBody,
  Input,
  CardFooter,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { type SACH } from "@prisma/client";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { api } from "@/utils/api";
import { contentMapping } from "@/constant/modal";

interface IBookModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem: SACH | null;
  setCurrentItem: Dispatch<SetStateAction<SACH | null>>;
}
type TValues = {
  MaSach: number;
  NhaXuatBan: string;
  NamXuatBan: string;
  DonGiaBan: string;
  SoLuongTon: string;
  MaDauSach: number;
};
const defaultValues: TValues = {
  MaSach: 0,
  NhaXuatBan: "",
  NamXuatBan: "",
  DonGiaBan: "0",
  SoLuongTon: "0",
  MaDauSach: 0,
};

const BookModal: React.FC<IBookModal> = ({
  open,
  handleOpen,
  currentItem,
  setCurrentItem,
}) => {
  const [values, setValues] = useState<TValues>(defaultValues);
  const utils = api.useContext();
  const { data: titles, isLoading: isLoadingTitles } =
    api.title.getAll.useQuery();

  const clearValueAfterClose = () => {
    setValues(defaultValues);
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget;
    setValues((p) => ({ ...p, [name]: value }));
  };

  const { mutate: updateFunc, status: updateStatus } =
    api.book.update.useMutation({
      onSuccess() {
        executeAfter500ms(async () => {
          handleOpen();
          clearValueAfterClose();
          setCurrentItem(null);
          await utils.book.getWithPagination.refetch();
        });
      },
      onError(err) {
        console.error(err);
        handleOpen();
      },
    });

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const req = {
      MaSach: values.MaSach,
      MaDauSach: values.MaDauSach,
      NamXuatBan: values.NamXuatBan,
      NhaXuatBan: values.NhaXuatBan,
      DonGiaBan: Number.parseFloat(values.DonGiaBan),
      SoLuongTon: Number.parseInt(values.SoLuongTon),
    };
    updateFunc(req);
  };

  const status = updateStatus;

  useEffect(() => {
    if (currentItem) {
      const { MaSach, MaDauSach, NhaXuatBan, NamXuatBan } = currentItem;
      setValues({
        MaSach,
        MaDauSach,
        NhaXuatBan,
        NamXuatBan,
        SoLuongTon: currentItem.SoLuongTon.toString(),
        DonGiaBan: currentItem.DonGiaBan.toString(),
      });
    } else {
      setValues(defaultValues);
    }
  }, [currentItem]);

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <form onSubmit={onSubmit}>
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography className="font-bold">Cập nhật sách</Typography>{" "}
            <Select
              label="Đầu sách"
              disabled={isLoadingTitles}
              value={(values.MaDauSach as number | null)?.toString()}
              onChange={(e) => {
                setValues((p) => ({ ...p, MaDauSach: parseInt(e as string) }));
              }}
            >
              {titles &&
                titles.map((item) => (
                  <Option
                    key={item.MaDauSach}
                    value={item.MaDauSach.toString()}
                  >
                    {item.TenDauSach}
                  </Option>
                ))}
            </Select>
            <Input
              label="Nhà xuất bản"
              size="lg"
              name="NhaXuatBan"
              value={values.NhaXuatBan}
              onChange={onChange}
              required
            />
            <Input
              label="Năm xuất bản"
              size="lg"
              name="NamXuatBan"
              value={values.NamXuatBan}
              onChange={onChange}
              required
            />
            <Input
              label="Đơn giá bán"
              size="lg"
              name="GonGiaBan"
              value={values.DonGiaBan}
              onChange={onChange}
              required
            />
            <Input
              label="Số lượng tồn"
              size="lg"
              name="SoLuongTon"
              value={values.SoLuongTon}
              onChange={onChange}
              required
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" type="submit" fullWidth>
              {
                contentMapping(!!currentItem)[
                  status as unknown as keyof typeof contentMapping
                ]
              }
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
};

export default BookModal;

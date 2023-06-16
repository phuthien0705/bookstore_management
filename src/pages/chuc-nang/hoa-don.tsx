import AddCustomerModal from "@/content/customer/AddCustomerModal";
import DashboardLayout from "@/layouts/dashboard";
import { api } from "@/utils/api";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { moneyFormat } from "@/utils/moneyFormat";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import Head from "next/head";
import { useEffect, useState } from "react";
import { type NextPageWithLayout } from "../page";

const TABLE_HEAD = [
  "STT",
  "Sách",
  "Đơn giá bán",
  "Số lượng",
  "Thành tiền",
  "Xóa sách",
];

type TKhachHanng = {
  MaKH: number;
  HoTen: string;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
  TienNo: number;
};
const defaultValue: TKhachHanng = {
  MaKH: 0,
  HoTen: "",
  DiaChi: "",
  SoDienThoai: "",
  Email: "",
  TienNo: 0,
};

type BID = {
  MaSach: number;
};
const defaultBID: BID = {
  MaSach: 0,
};
type LBook = {
  MaSach: number;
  SoLuong: number;
  DonGia: string;
  ThanhTien: string;
};
const HoaDon: NextPageWithLayout = () => {
  const [today, setDate] = useState(new Date());

  const utils = api.useContext();
  const { data: KhachHang, isLoading: isLoadingKH } =
    api.customer.getKhachHang.useQuery();

  const { data: Books, isLoading: isLoadingBook } =
    api.book.getAllBookWithTitle.useQuery();
  const { data: thamchieu } = api.reference.get.useQuery();
  const [quantity, setQuantity] = useState(1);
  const [selectKH, setKH] = useState<TKhachHanng>(defaultValue);
  const [currentBook, setCurrentBook] = useState<BID>(defaultBID);
  const [list, setList] = useState<LBook[]>([]);
  const [total, setTotal] = useState<string>("0");
  const [pay, setPay] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);

  const { mutate: updateDebitFunc } =
    api.invoice.updateDebitOnNewInvoice.useMutation({
      onSuccess: () => {
        executeAfter500ms(async () => {
          await utils.customer.getKhachHang.refetch();
          await utils.book.getAllBookWithTitle.refetch();
        });
      },
      onError(err) {
        console.error(err);
      },
    });

  const { mutate: updateBookQtFunc } =
    api.statistic.updateBookLeftStatistic.useMutation();

  const { mutate: createHDFunc, status: createHDStatus } =
    api.invoice.createHD.useMutation({
      onSuccess() {
        executeAfter500ms(async () => {
          updateDebitFunc({
            MaKH: selectKH.MaKH,
            NoHienTai: Number(
              KhachHang?.find((i) => i.MaKH == selectKH.MaKH)?.TienNo ||
                undefined
            ),
            ConLai: debit,
          });
          list.map((i) =>
            updateBookQtFunc({
              maSach: i.MaSach,
              month: new Date().getMonth(),
              year: new Date().getMonth(),
              quantity: i.SoLuong,
            })
          );
          clearAll();
          await utils.customer.getKhachHang.refetch();
          await utils.book.getAllBookWithTitle.refetch();
          await utils.reference.get.refetch();
        });
      },
      onError(err) {
        console.error(err);
      },
    });

  const clearAll = () => {
    setQuantity(1);
    setKH(defaultValue);
    setCurrentBook(defaultBID);
    setList([]);
    setTotal("0");
    setPay(0);
    setDebit(0);
  };

  const handleAddBook = () => {
    let dongia;
    let thanhtien;
    if (Books) {
      dongia = Books?.find((i) => i.MaSach == currentBook.MaSach)?.DonGiaBan;
      if (dongia) {
        thanhtien = Number(dongia) * Number(quantity) || 0;
      }
    }

    if (list.length == 0) {
      setList([
        {
          MaSach: currentBook.MaSach,
          SoLuong: quantity,
          DonGia: dongia?.toString() ?? "0",
          ThanhTien: thanhtien?.toString() ?? "0",
        },
      ]);
      setTotal(thanhtien?.toString() ?? "0");
    } else {
      list.push({
        MaSach: currentBook.MaSach,
        SoLuong: quantity,
        DonGia: dongia?.toString() ?? "0",
        ThanhTien: thanhtien?.toString() ?? "0",
      });
      setList(list);
      setTotal((Number(thanhtien) + Number(total)).toString());
    }

    setQuantity(1);
    setCurrentBook(defaultBID);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    createHDFunc({
      TongTien: parseInt(total),
      MaKH: selectKH.MaKH,
      CT_HOADON: list.map((i) => ({
        MaSach: i.MaSach,
        SoLuong: i.SoLuong,
        DonGia: parseInt(i.DonGia),
        ThanhTien: parseInt(i.ThanhTien),
      })),
    });
  };

  useEffect(() => {
    setDebit(Number(total) - pay);
  }, [total]);
  useEffect(() => {
    setDebit(Number(total) - pay);
  }, [pay]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <Head>
        <title>Hóa Đơn Bán Sách</title>
      </Head>
      <div>
        <div className="mb-8 mt-12 flex flex-col gap-12">
          <form className="m-4" onSubmit={handleSubmit}>
            <Card className=" p-4">
              <CardHeader variant="gradient" color="blue" className="mb-2 p-6">
                <Typography variant="h6" color="white">
                  Hóa đơn bán sách
                </Typography>
              </CardHeader>

              <CardBody className="px-0 pb-2 pt-4">
                <div className="flex w-full flex-row items-center justify-between ">
                  <div className="w-300">
                    <Select
                      label="Khách hàng (Tên - SĐT): "
                      variant="static"
                      className="max-w-300"
                      disabled={isLoadingKH}
                      onChange={(e) => {
                        setKH((p) => ({ ...p, MaKH: parseInt(e as string) }));
                      }}
                    >
                      {isLoadingKH ? (
                        <Option>Đang tải...</Option>
                      ) : KhachHang && KhachHang.length > 0 ? (
                        KhachHang.map((item) => (
                          <Option
                            key={item.MaKH}
                            value={item.MaKH.toString()}
                            className="max-w-300"
                          >
                            KH: {item.HoTen}
                            {" - SDT: "}
                            {item.SoDienThoai}
                          </Option>
                        ))
                      ) : (
                        <Option>Không có dữ liệu</Option>
                      )}
                    </Select>
                  </div>
                  {selectKH !== defaultValue && (
                    <Typography>
                      Số tiền đang nợ:{" "}
                      {moneyFormat(
                        Number(
                          KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                            ?.TienNo || undefined
                        )
                      )}
                      VNĐ
                    </Typography>
                  )}
                  <Typography className="font-bold">
                    Ngày lập hóa đơn: {dayjs(today).format("ddd, DD/MM/YYYY")}
                  </Typography>
                </div>
                <Typography className="mb-4 mt-4 font-bold">
                  Thông tin sách
                </Typography>
                <div className="flex flex-row items-center justify-between">
                  <div className="md:w-56">
                    <Select
                      label="Chọn sách thêm vào hóa đơn: "
                      variant="static"
                      disabled={isLoadingBook}
                      onChange={(e) => {
                        setCurrentBook((p) => ({
                          ...p,
                          MaSach: parseInt(e as string),
                        }));
                      }}
                    >
                      {isLoadingBook ? (
                        <Option>Đang tải sách...</Option>
                      ) : Books && Books.length > 0 ? (
                        Books.map((item) => (
                          <Option
                            disabled={
                              list.find((i) => i.MaSach == item.MaSach)
                                ? true
                                : false
                            }
                            key={item.MaSach}
                            value={item.MaSach.toString()}
                          >
                            {item.DauSach.TenDauSach.toString() +
                              " - " +
                              "Xuất bản: " +
                              item.NamXuatBan.toString() +
                              " (Qt: " +
                              item.SoLuongTon.toString() +
                              ")"}
                          </Option>
                        ))
                      ) : (
                        <Option>Không có dữ liệu sách</Option>
                      )}
                    </Select>
                  </div>
                  <div className=" flex flex-row items-center justify-center gap-2">
                    <Input
                      className="w-10"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(parseInt(e.target.value || "1"));
                      }}
                    />
                    <div className="flex flex-col items-center justify-center">
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        disabled={
                          Number(
                            Books?.find((i) => i.MaSach == currentBook.MaSach)
                              ?.SoLuongTon || -99999999999
                          ) -
                            Number(quantity) <=
                          Number(thamchieu?.TonKhoToiThieuSauBan || -999999)
                            ? true
                            : false
                        }
                        onClick={() => {
                          setQuantity(quantity + 1);
                        }}
                      >
                        <ChevronUpIcon
                          strokeWidth={3}
                          className="h-6 w-6 text-blue-gray-500"
                        />
                      </IconButton>
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        disabled={quantity === 1}
                        onClick={() => {
                          setQuantity(quantity - 1);
                        }}
                      >
                        <ChevronDownIcon
                          strokeWidth={3}
                          className="h-6 w-6 text-blue-gray-500"
                        />
                      </IconButton>
                    </div>
                    <IconButton
                      variant="text"
                      color="blue"
                      disabled={
                        Number(
                          Books?.find((i) => i.MaSach == currentBook.MaSach)
                            ?.SoLuongTon || -99999999999
                        ) -
                          Number(quantity) <
                        Number(thamchieu?.TonKhoToiThieuSauBan || -999999)
                          ? true
                          : false
                      }
                      onClick={handleAddBook}
                    >
                      <PaperAirplaneIcon
                        strokeWidth={1}
                        className="h-10 w-10 text-blue-500"
                      />
                    </IconButton>
                  </div>
                </div>
                <div className="mb-4 mt-4 flex flex-col gap-6">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map((head) => (
                          <th
                            key={head}
                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                          >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    {list.length > 0 ? (
                      <tbody>
                        {Books &&
                          Books.map((items, index) => {
                            if (!!!list.find((i) => i.MaSach == items.MaSach)) {
                              return;
                            }
                            return (
                              <tr
                                key={index}
                                className="even:bg-blue-gray-50/50"
                              >
                                <td className="p-4">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {index}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {items.DauSach.TenDauSach}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {moneyFormat(Number(items.DonGiaBan))}VNĐ
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {list.length > 0
                                      ? list.find(
                                          (i) => i.MaSach == items.MaSach
                                        )?.SoLuong
                                      : null}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {list.length > 0
                                      ? moneyFormat(
                                          Number(
                                            list.find(
                                              (i) => i.MaSach == items.MaSach
                                            )?.ThanhTien
                                          )
                                        )
                                      : moneyFormat(0)}
                                    VNĐ
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography
                                    as="button"
                                    onClick={() => {
                                      setList(
                                        list.filter(
                                          (cailon) =>
                                            cailon.MaSach != items.MaSach
                                        )
                                      );
                                      setTotal(
                                        (
                                          Number(total) -
                                          Number(
                                            list?.find(
                                              (i) => i.MaSach == items.MaSach
                                            )?.ThanhTien || "0"
                                          )
                                        ).toString()
                                      );
                                    }}
                                    variant="small"
                                    color="blue"
                                    className="font-medium"
                                  >
                                    Xóa
                                  </Typography>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    ) : (
                      <tbody className="mx-5">
                        <tr>
                          <td colSpan={5} className=" align-center font-bold">
                            <Typography className="text-align-center font-bold">
                              Hãy thêm sách vào hóa đơn!
                            </Typography>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                  <div>
                    <Typography>
                      Tổng tiền: {moneyFormat(Number(total))}VNĐ
                    </Typography>
                    <div className="flex flex-row">
                      <Typography className="basis-1/2">
                        Số tiền trả: {moneyFormat(Number(pay))}VNĐ
                      </Typography>
                      <Input
                        className="w-10 basis-1/4"
                        label="Số tiền trả"
                        value={pay}
                        onChange={(e) => {
                          setPay(parseInt(e.target.value || "0"));
                          setDebit(Number(total) - pay);
                        }}
                      />
                    </div>
                    <Typography>
                      Còn lại: {moneyFormat(Number(total) - pay)}VNĐ
                    </Typography>
                  </div>
                </div>
                <div className=" flex justify-end space-x-2">
                  <Button
                    type="submit"
                    className="mt-2"
                    disabled={
                      Number(pay) > Number(total) ||
                      Number(
                        KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                          ?.TienNo || 0
                      ) > Number(thamchieu?.CongNoToiDa || 0) ||
                      Number(
                        KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                          ?.TienNo || 0
                      ) +
                        debit >
                        Number(thamchieu?.CongNoToiDa || 0) ||
                      !selectKH.MaKH ||
                      list.length == 0
                        ? true
                        : false
                    }
                  >
                    Tạo và in hóa đơn
                  </Button>
                  <AddCustomerButton />
                  <Button className="mt-2">Thanh toán nợ cũ</Button>
                </div>
              </CardBody>
            </Card>
          </form>
        </div>
      </div>
    </>
  );
};

const AddCustomerButton = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((p) => !p);
  return (
    <>
      <Button onClick={toggle} className="mt-2">
        Thêm khách hàng
      </Button>
      <AddCustomerModal open={open} handleOpen={toggle} />
    </>
  );
};

HoaDon.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default HoaDon;

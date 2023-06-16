import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { type NextPageWithLayout } from "../page";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import DashboardLayout from "@/layouts/dashboard";
import { api } from "@/utils/api";
import { moneyFormat, parseMoneyFormat } from "@/utils/moneyFormat";
import { useReactToPrint } from "react-to-print";
import { useRouter } from 'next/router';

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
    api.invoice.getKhachHang.useQuery();

  const { data: Books, isLoading: isLoadingBook } =
    api.invoice.getAllBookWithTitle.useQuery();
  const { data: thamchieu } = api.invoice.getThamChieu.useQuery();
  const [quantity, setQuantity] = useState(1);
  const [selectKH, setKH] = useState<TKhachHanng>(defaultValue);
  const [currentBook, setCurrentBook] = useState<BID>(defaultBID);
  const [list, setList] = useState<LBook[]>([]);
  const [total, setTotal] = useState<string>("0");
  const [pay, setPay] = useState<string>("0");
  const [debit, setDebit] = useState<number>(0);
  const router = useRouter();
  const clearAll = () => {
    setQuantity(1);
    setKH(defaultValue);
    setCurrentBook(defaultBID);
    setList([]);
    setTotal("0");
    setPay("0");
    setDebit(0);
  };
  const invoicePDF = useRef(null);
  const printInvoice = useReactToPrint({
    content: () => invoicePDF.current,
  });
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
  const { mutate: createHDFunc } = api.invoice.createHD.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        updateDebitFunc({
          MaKH: selectKH.MaKH,
          NoHienTai: Number(
            KhachHang?.find((i) => i.MaKH == selectKH.MaKH)?.TienNo || undefined
          ),
          ConLai: debit,
        });
        list.map((i) =>
          updateBookQtFunc({
            MaSach: i.MaSach,
            Current: Books?.find((s) => s.MaSach == i.MaSach)?.SoLuongTon || 0,
            Quantity: i.SoLuong,
          })
        );
        printInvoice();
        clearAll();
        await utils.invoice.getKhachHang.refetch();
        await utils.invoice.getAllBookWithTitle.refetch();
        await utils.invoice.getThamChieu.refetch();
        toast.success("Tạo hóa đơn thành công");
      });
    },
    onError(err) {
      console.error(err);
      toast.error("Xảy ra lỗi trong quá trình tạo hóa đơn");
    },
  });

  const { mutate: updateDebitFunc } =
    api.invoice.updateDebitOnNewInvoice.useMutation({
      onSuccess: () => {
        executeAfter500ms(async () => {
          await utils.invoice.getKhachHang.refetch();
          await utils.invoice.getAllBookWithTitle.refetch();
        });
        toast.success("Đã cập nhật nợ khách hàng thành công");
      },
      onError(err) {
        console.error(err);
        toast.error("Xảy ra lỗi trong quá trình thanh toán nợ");
      },
    });

  const { mutate: updateBookQtFunc } =
    api.invoice.updateBookQuantity.useMutation();

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
    setDebit(Number(total) - parseMoneyFormat(pay));
  }, [total]);
  useEffect(() => {
    setDebit(Number(total) - parseMoneyFormat(pay));
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
        <div className="mb-8 mt-12 flex flex-col gap-12" ref={invoicePDF}>
          <form className="m-4" onSubmit={handleSubmit}>
            <Card className=" p-4">
              <CardHeader variant="gradient" color="blue" className="mb-2 p-6">
                <Typography variant="h6" color="white">
                  Hóa đơn bán sách
                </Typography>
              </CardHeader>

              <CardBody className="overflow-x-scroll px-0 pb-2 pt-4">
                <Typography className="text-lg ">
                  <span className="font-bold">Ngày lập hóa đơn:</span>{" "}
                  {today.toLocaleDateString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </Typography>
                <Typography className="mb-4 mt-2 font-bold">
                  Thông tin khách hàng
                </Typography>
                <div className="flex w-full flex-col items-start justify-between gap-2">
                  <div className="w-1/2">
                    {" "}
                    <Select
                      variant="static"
                      label="Khách hàng (Tên - SĐT): "
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
                  <div className="w-full">
                    {" "}
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
                  </div>
                </div>
                <Typography className="mb-0 mt-4 font-bold">
                  Thông tin sách
                </Typography>
                <div className="flex items-center justify-between gap-4">
                  <div className="w-1/2">
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
                  <div className="flex flex-1 items-center justify-center gap-2">
                    <Input
                      variant="static"
                      label="Số lượng"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(parseInt(e.target.value || "1"));
                      }}
                    />
                    <div className="flex flex-col items-center justify-center">
                      <IconButton
                        size="sm"
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
                        size="sm"
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
                      variant="filled"
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
                      <PlusIcon strokeWidth={3} className="h-4 w-4" />
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
                                  <IconButton
                                    variant="text"
                                    color="red"
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
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </IconButton>
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
                              {" "}
                              Hãy thêm sách vào hóa đơn!
                            </Typography>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                  <div className="flex justify-between">
                    <div>
                      <Typography>
                        Tổng tiền: {moneyFormat(parseMoneyFormat(total))}VNĐ
                      </Typography>
                      <Typography className="basis-1/2">
                        Số tiền trả: {moneyFormat(parseMoneyFormat(pay))}VNĐ
                      </Typography>

                      <Typography>
                        Còn lại:{" "}
                        {moneyFormat(Number(total) - parseMoneyFormat(pay))}VNĐ
                      </Typography>
                    </div>
                    <div className="w-1/2">
                      {" "}
                      <Input
                        className="w-10 basis-1/4"
                        label="Số tiền trả"
                        value={pay}
                        onChange={(e) => {
                          setPay(
                            moneyFormat(parseMoneyFormat(e.target.value ?? "0"))
                          );
                          setDebit(Number(total) - parseMoneyFormat(pay));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end space-x-2">
                  <Button
                    type="submit"
                    className="mt-2"
                    disabled={
                      parseMoneyFormat(pay) > Number(total) ||
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
                  <Button className="mt-2">Thêm khách hàng</Button>
                  <Button
                    className="mt-2"
                    onClick={() => router.push("/chuc-nang/thu-tien")}
                  >
                    Thanh toán nợ cũ
                  </Button>
                </div>
              </CardBody>
            </Card>
          </form>
        </div>
      </div>
    </>
  );
};
HoaDon.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default HoaDon;

import { EFilterBookInvoice, EFilterKHInvoice } from "@/constant/constant";
import AddCustomerModal from "@/content/customer/AddCustomerModal";
import useDebounce from "@/hook/useDebounce";
import DashboardLayout from "@/layouts/dashboard";
import { api } from "@/utils/api";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { moneyFormat, parseMoneyFormat } from "@/utils/moneyFormat";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
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
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
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
  const { data: sessionData } = useSession();
  const { data: thamso } = api.invoice.getReference.useQuery();
  const [quantity, setQuantity] = useState(1);
  const [selectKH, setKH] = useState<TKhachHanng>(defaultValue);
  const [currentBook, setCurrentBook] = useState<BID>(defaultBID);
  const [list, setList] = useState<LBook[]>([]);
  const [total, setTotal] = useState<string>("0");
  const [pay, setPay] = useState<string>("0");
  const [debit, setDebit] = useState<number>(0);
  // Filter and search states
  const [filterVaule, setFilterValue] = useState(EFilterBookInvoice.all);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchValueDebounced, setSearchValueDebounced] = useState<string>("");
  const debounced = useDebounce({ value: searchValue, delay: 500 });
  // Search Customer
  const [filterVauleKH, setFilterValueKH] = useState(EFilterKHInvoice.all);
  const [searchValueKH, setSearchValueKH] = useState<string>("");
  const [searchValueDebouncedKH, setSearchValueDebouncedKH] =
    useState<string>("");
  const debouncedKH = useDebounce({ value: searchValueKH, delay: 500 });
  const clearAll = () => {
    setFilterValue(EFilterBookInvoice.all);
    setFilterValueKH(EFilterKHInvoice.all);
    setSearchValue("");
    setSearchValueKH("");
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
    if (Books && thamso && thamso.SuDungQuyDinh == true) {
      dongia =
        (Number(
          Books.datas.find((i) => i.MaSach == currentBook.MaSach)?.DonGiaBan
        ) ?? 0) *
        (Number(thamso.TyLeDonGia) / 100);
      if (dongia && thamso) {
        thanhtien = Number(dongia) * (Number(quantity) || 0);
      }
    } else if (thamso?.SuDungQuyDinh == false) {
      dongia =
        Number(
          Books?.datas?.find((i) => i.MaSach == currentBook.MaSach)?.DonGiaBan
        ) ?? 0;
      if (dongia && thamso) {
        thanhtien = Number(dongia) * (Number(quantity) || 0);
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

  const { mutate: updateBookLeftFunc } =
    api.statistic.updateBookLeftStatistic.useMutation();

  const { mutate: updateBookQtFunc } = api.book.updateQt.useMutation();

  const { mutate: updateUserDept } =
    api.statistic.updateUserDebtStatistic.useMutation();

  const { data: KhachHang, isLoading: isLoadingKH } =
    api.invoice.getKhachHangWithSearch.useQuery({
      searchValue: searchValueDebouncedKH,
      type: filterVauleKH,
    });

  const {
    data: Books,
    isLoading: isLoadingBook,
    isFetching,
  } = api.invoice.getBookWithSearch.useQuery({
    searchValue: searchValueDebounced,
    type: filterVaule,
    SLTon:
      thamso?.SuDungQuyDinh == true ? thamso?.TonKhoToiThieuSauBan ?? 0 : 0,
  });

  const { mutate: createHDFunc } = api.invoice.createHD.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        updateDebitFunc({
          MaKH: selectKH.MaKH,
          NoHienTai: Number(
            KhachHang?.datas?.find((i) => i.MaKH == selectKH.MaKH)?.TienNo ||
              undefined
          ),
          ConLai: debit,
        });

        updateUserDept({
          maKH: selectKH.MaKH,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          increaseQuantity: debit,
          decreaseQuantity: 0,
        });

        list.map((i) => {
          updateBookLeftFunc({
            maSach: i.MaSach,
            decreaseQuantity: i.SoLuong,
            increaseQuantity: 0,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          });
          updateBookQtFunc({
            MaSach: i.MaSach,
            Quantity: i.SoLuong,
          });
        });

        await utils.invoice.getKhachHangWithSearch.refetch();
        await utils.invoice.getBookWithSearch.refetch();
        await utils.invoice.getReference.refetch();
        toast.success("Tạo hóa đơn thành công");
        printInvoice();
        clearAll();
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
          await utils.invoice.getKhachHangWithSearch.refetch();
          await utils.invoice.getBookWithSearch.refetch();
        });
        toast.success("Đã cập nhật nợ khách hàng thành công");
      },
      onError(err) {
        console.error(err);
        toast.error("Xảy ra lỗi trong quá trình thanh toán nợ");
      },
    });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    createHDFunc({
      MaTK: sessionData?.user?.MaTK || -9,
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
  }, [total, pay]);

  useEffect(() => {
    setSearchValueDebounced(searchValue);
  }, [debounced]);

  useEffect(() => {
    setSearchValueDebouncedKH(searchValueKH);
  }, [debouncedKH]);
  return (
    <>
      <Head>
        <title>Hóa Đơn Bán Sách</title>
      </Head>
      <div>
        <div className="mb-8 mt-12" ref={invoicePDF}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader
                variant="gradient"
                color="blue"
                className="mb-2 flex items-center justify-between px-6 py-4"
              >
                <Typography variant="h6" color="white">
                  Hóa đơn bán sách
                </Typography>
              </CardHeader>

              <CardBody className="p-4">
                <Typography className="text-lg ">
                  <span className="font-bold">Ngày lập hóa đơn:</span>{" "}
                  {today.toLocaleDateString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </Typography>
                <Typography className="mb-4 mt-2 font-bold">
                  Thông tin khách hàng
                </Typography>
                {/* Search KH */}
                <div className="m-4 flex justify-end gap-2">
                  <div className="w-full md:w-56">
                    <Select
                      label="Tìm kiếm theo"
                      onChange={(e) => {
                        setFilterValueKH(e as unknown as EFilterKHInvoice);
                      }}
                    >
                      <Option value={EFilterKHInvoice.all}>Tất cả</Option>{" "}
                      <Option value={EFilterKHInvoice.MaKH}>ID khách</Option>
                      <Option value={EFilterKHInvoice.HoTen}>Họ tên</Option>
                      <Option value={EFilterKHInvoice.SoDienThoai}>
                        Số điện thoại
                      </Option>
                    </Select>
                  </div>
                  <div className="w-full md:w-56">
                    <Input
                      label="Tìm kiếm khách hàng"
                      icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                      value={searchValueKH}
                      onChange={(e) => setSearchValueKH(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-2">
                  <div className="w-1/2">
                    {" "}
                    <Select
                      variant="static"
                      label="Khách hàng: "
                      disabled={isLoadingKH}
                      onChange={(e) => {
                        setKH((p) => ({ ...p, MaKH: parseInt(e as string) }));
                      }}
                    >
                      {isLoadingKH ? (
                        <Option>Đang tải...</Option>
                      ) : KhachHang && KhachHang?.datas?.length > 0 ? (
                        KhachHang?.datas?.map((item) => (
                          <Option
                            disabled={
                              Number(item.TienNo) >=
                              Number(
                                thamso?.SuDungQuyDinh == true
                                  ? thamso?.CongNoToiDa || 0
                                  : 9999999999999
                              )
                            }
                            key={item.MaKH}
                            value={item.MaKH.toString()}
                            className="max-w-300"
                          >
                            ID:{item.MaKH.toString()} {item.HoTen}
                            {" - SDT: "}
                            {item.SoDienThoai}
                            {Number(item.TienNo) >=
                            Number(
                              thamso?.SuDungQuyDinh == true
                                ? thamso?.CongNoToiDa || 0
                                : 9999999999999
                            )
                              ? ` (Khách hàng này đã vượt mức nợ quy định là: ${moneyFormat(
                                  thamso?.SuDungQuyDinh == true
                                    ? thamso?.CongNoToiDa || 0
                                    : 9999999999999
                                )} VNĐ! Thanh toán nợ cũ để mua tiếp) `
                              : ""}
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
                            KhachHang?.datas?.find(
                              (i) => i.MaKH == selectKH.MaKH
                            )?.TienNo || undefined
                          )
                        )}
                        VNĐ
                      </Typography>
                    )}
                  </div>
                </div>
                <Typography className="mb-4 mt-4 font-bold">
                  Thông tin sách
                </Typography>
                <div className="m-4 flex justify-end gap-2">
                  <div className="w-full md:w-56">
                    <Select
                      label="Tìm kiếm theo"
                      // value={filterVaule}
                      onChange={(e) => {
                        setFilterValue(e as unknown as EFilterBookInvoice);
                      }}
                    >
                      <Option value={EFilterBookInvoice.all}>Tất cả</Option>{" "}
                      <Option value={EFilterBookInvoice.bookId}>Mã Sách</Option>
                      <Option value={EFilterBookInvoice.title}>Tên sách</Option>
                    </Select>
                  </div>
                  <div className="w-full md:w-56">
                    <Input
                      label="Tìm kiếm sản phẩm"
                      icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </div>
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
                      ) : Books && Books.datas.length > 0 ? (
                        Books.datas.map((item) => (
                          <Option
                            disabled={
                              list.find((i) => i.MaSach == item.MaSach)
                                ? true
                                : false
                            }
                            key={item.MaSach}
                            value={item.MaSach.toString()}
                          >
                            {"MS: " +
                              item.MaSach.toString() +
                              " " +
                              item.DauSach.TenDauSach.toString() +
                              " - " +
                              "Xuất bản: " +
                              item.NamXuatBan.toString() +
                              " (Qt: " +
                              item.SoLuongTon.toString() +
                              ") - Đơn giá: " +
                              moneyFormat(
                                Number(item.DonGiaBan) *
                                  Number(
                                    thamso?.SuDungQuyDinh == true
                                      ? Number(thamso.TyLeDonGia) / 100
                                      : 1
                                  )
                              ) +
                              " VNĐ"}
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
                        if (e.target.value.includes("-")) return;
                        // if (!isStringNumeric(e.target.value)) return;
                        setQuantity(Number(e.target.value || "0"));
                      }}
                    />
                    <IconButton
                      variant="filled"
                      color="blue"
                      disabled={
                        Number(
                          Books?.datas?.find(
                            (i) => i.MaSach == currentBook.MaSach
                          )?.SoLuongTon ?? -99999999999
                        ) -
                          Number(quantity) <
                          Number(
                            thamso?.SuDungQuyDinh == true
                              ? thamso?.TonKhoToiThieuSauBan ?? 0
                              : 0
                          ) ||
                        quantity === 0 ||
                        quantity === null
                      }
                      onClick={handleAddBook}
                    >
                      <PlusIcon strokeWidth={3} className="h-4 w-4" />
                    </IconButton>
                  </div>
                  {Number(
                    Books?.datas?.find((i) => i.MaSach == currentBook.MaSach)
                      ?.SoLuongTon ?? -99999999999
                  ) -
                    Number(quantity) <
                    Number(
                      thamso?.SuDungQuyDinh == true
                        ? thamso?.TonKhoToiThieuSauBan ?? 0
                        : 0
                    ) && currentBook !== defaultBID ? (
                    <Typography className="text-red-500">
                      Tồn kho tối thiểu sau khi bán phải lớn hơn{" "}
                      {thamso?.SuDungQuyDinh == true
                        ? thamso?.TonKhoToiThieuSauBan ?? 0
                        : 0}
                      !
                    </Typography>
                  ) : (
                    ""
                  )}
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
                          Books.datas.map((items, index) => {
                            if (!list.find((i) => i.MaSach == items.MaSach)) {
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
                                    {thamso &&
                                      moneyFormat(
                                        Number(items.DonGiaBan) *
                                          Number(
                                            thamso?.SuDungQuyDinh == true
                                              ? Number(thamso.TyLeDonGia) / 100
                                              : 1
                                          )
                                      ) + "VNĐ"}
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
                                          (ft) => ft.MaSach != items.MaSach
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
                        {Number(total) - parseMoneyFormat(pay) > 0
                          ? moneyFormat(Number(total) - parseMoneyFormat(pay))
                          : 0}
                        VNĐ
                      </Typography>

                      <Typography>
                        Tiền thối:{" "}
                        {Number(total) - parseMoneyFormat(pay) <= 0
                          ? moneyFormat(-Number(total) + parseMoneyFormat(pay))
                          : 0}
                        VNĐ
                      </Typography>
                    </div>
                    <div className="w-1/2">
                      <Input
                        className="w-10 basis-1/4"
                        label="Số tiền trả"
                        value={pay}
                        onChange={(e) => {
                          setPay(
                            moneyFormat(parseMoneyFormat(e.target.value ?? "0"))
                          );
                          setDebit(
                            Number(total) - parseMoneyFormat(pay) > 0
                              ? Number(total) - parseMoneyFormat(pay)
                              : 0
                          );
                        }}
                      />
                      {Number(
                        KhachHang?.datas?.find((i) => i.MaKH == selectKH.MaKH)
                          ?.TienNo || 0
                      ) >
                        Number(
                          thamso?.SuDungQuyDinh == true
                            ? thamso?.CongNoToiDa || 0
                            : 9999999999999
                        ) ||
                      (Number(
                        KhachHang?.datas?.find((i) => i.MaKH == selectKH.MaKH)
                          ?.TienNo || 0
                      ) +
                        debit >
                        Number(
                          thamso?.SuDungQuyDinh == true
                            ? thamso?.CongNoToiDa || 0
                            : 9999999999999
                        ) &&
                        selectKH !== defaultValue) ? (
                        <Typography className="text-red-500">
                          Tiền nợ của khách hàng không được vượt quá{" "}
                          {moneyFormat(
                            Number(
                              thamso?.SuDungQuyDinh == true
                                ? thamso?.CongNoToiDa || 0
                                : 9999999999999
                            )
                          )}
                          VNĐ!
                        </Typography>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end space-x-2">
                  <Button
                    type="submit"
                    className="mt-2"
                    disabled={
                      Number(
                        KhachHang?.datas?.find((i) => i.MaKH == selectKH.MaKH)
                          ?.TienNo || 0
                      ) >
                        Number(
                          thamso?.SuDungQuyDinh == true
                            ? thamso?.CongNoToiDa || 0
                            : 9999999999999
                        ) ||
                      Number(
                        KhachHang?.datas?.find((i) => i.MaKH == selectKH.MaKH)
                          ?.TienNo || 0
                      ) +
                        debit >
                        Number(
                          thamso?.SuDungQuyDinh == true
                            ? thamso?.CongNoToiDa || 0
                            : 9999999999999
                        ) ||
                      !selectKH.MaKH ||
                      !pay ||
                      list.length === 0
                        ? true
                        : false
                    }
                  >
                    Tạo và in hóa đơn
                  </Button>
                  <AddCustomerButton classname="mt-2" />
                </div>
              </CardBody>
            </Card>
          </form>
        </div>
      </div>
    </>
  );
};

export const AddCustomerButton = ({
  variant = "filled",
  classname = "",
}: {
  variant?: "filled" | "outlined";
  classname?: string;
}) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((p) => !p);
  return (
    <>
      <Button onClick={toggle} className={classname} variant={variant}>
        Thêm khách hàng
      </Button>
      <AddCustomerModal open={open} handleOpen={toggle} />
    </>
  );
};

HoaDon.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default HoaDon;

const defaultValue: KHACHHANG = {
  MaKH: 0,
  HoTen: "",
  DiaChi: "",
  SoDienThoai: "",
  Email: "",
  TienNo: new Prisma.Decimal(0),
};

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import Head from "next/head";
import dayjs from "dayjs";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { useState, useEffect, useRef } from "react";
import { api } from "@/utils/api";
import { Prisma, type KHACHHANG } from "@prisma/client";
import { moneyFormat, parseMoneyFormat } from "@/utils/moneyFormat";
import { executeAfter500ms } from "@/utils/executeAfter500ms";

import { toast } from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

const TABLE_HEAD = ["Tên khách hàng", "Địa chỉ", "Email", "Số điện thoại"];

const ThuTien: NextPageWithLayout = () => {
  const { data: KhachHang, isLoading: isLoadingKH } =
    api.invoice.getKhachHang.useQuery();
  const [today, setDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const utils = api.useContext();
  const [selectKH, setKH] = useState<KHACHHANG>(defaultValue);
  const [pay, setPay] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [curr, setCurr] = useState<number>(0);
  const payPDF = useRef(null);
  const printPay = useReactToPrint({
    content: () => payPDF.current,
  });
  useEffect(() => {
    setDebit(Number(curr) - pay);
  }, [curr]);
  useEffect(() => {
    setDebit(Number(curr) - pay);
  }, [pay]);
  const clearAll = () => {
    setKH(defaultValue);
    setPay(0);
    setDebit(0);
    setCurr(0);
  };
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    createPTFunc({
      SoTien: pay,
      MaKH: selectKH.MaKH,
    });
  };
  const { mutate: updateDebitFunc, status: updateBookStatus } =
    api.invoice.updateDebit.useMutation();
  const { mutate: createPTFunc } = api.invoice.createPhieuThuTien.useMutation({
    onSuccess() {
      updateDebitFunc({
        MaKH: selectKH.MaKH,
        NewDebit: debit,
      });
      executeAfter500ms(async () => {
        printPay();
        clearAll();
        await utils.invoice.getKhachHang.refetch();
        toast.success("Tạo phiếu thu tiền thành công!");
      });
    },
    onError(err) {
      console.error(err);
      toast.error("Xảy ra lỗi trong quá trình phiếu thu tiền!");
    },
  });

  return (
    <>
      <Head>
        <title>Phiếu Thu Tiền</title>
      </Head>
      <div>
        <div className="mb-8 mt-12" ref={payPDF}>
          <Card>
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-2 flex items-center justify-between px-6 py-4"
            >
              <Typography variant="h6" color="white">
                Phiếu Thu Tiền
              </Typography>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pb-2 pt-0">
              <form className="mx-6 mt-4" onSubmit={handleSubmit}>
                <Typography className="mb-2 mt-6 basis-1/2 text-lg font-bold">
                  Ngày lập phiếu thu:{" "}
                  {today.toLocaleDateString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </Typography>
                <Typography className="mb-4 font-bold">
                  Thông tin khách hàng
                </Typography>{" "}
                <div className="mb-4 mt-4 flex flex-col gap-6">
                  <div className="w-1/2">
                    <Select
                      label="Khách hàng (Tên - SĐT): "
                      variant="static"
                      disabled={isLoadingKH}
                      onChange={(e) => {
                        setKH((p) => ({ ...p, MaKH: parseInt(e as string) }));
                        setCurr(
                          Number(
                            KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                              ?.TienNo
                          )
                        );
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
                    <tbody>
                      <tr className="even:bg-blue-gray-50/50">
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {
                              KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                                ?.HoTen
                            }
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {
                              KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                                ?.DiaChi
                            }
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {
                              KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                                ?.Email
                            }
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {
                              KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                                ?.SoDienThoai
                            }
                          </Typography>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Typography className="basis-1/2">
                    Số tiền nợ:{" "}
                    {moneyFormat(
                      Number(
                        KhachHang?.find((i) => i.MaKH == selectKH.MaKH)
                          ?.TienNo ?? "0"
                      )
                    )}
                    VNĐ
                  </Typography>
                  <Typography className="basis-1/2">
                    Số tiền thu: {moneyFormat(parseMoneyFormat(pay.toString()))}
                    VNĐ
                  </Typography>
                  <Input
                    className="w-10 basis-1/4"
                    label="Số tiền thu"
                    value={pay}
                    onChange={(e) => {
                      setPay(Number(e.target.value || "0"));
                      setDebit(curr - pay);
                    }}
                  />
                  {debit < 0 ? (
                    <Typography>
                      Số tiền thu không được lớn hơn số tiền nợ!{" "}
                    </Typography>
                  ) : (
                    <Typography>
                      Còn lại: {moneyFormat(parseMoneyFormat(debit.toString()))}
                      {"VNĐ"}
                    </Typography>
                  )}
                </div>
                <div className=" flex justify-end space-x-2">
                  <Button
                    type="submit"
                    className="mt-6"
                    disabled={
                      isLoadingKH ||
                      selectKH == defaultValue ||
                      pay > curr ||
                      debit < 0 ||
                      pay == 0
                        ? true
                        : false
                    }
                  >
                    Thanh Toán và In Phiếu Thu
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
ThuTien.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default ThuTien;

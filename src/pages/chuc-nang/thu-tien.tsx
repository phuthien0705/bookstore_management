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
  CardFooter,
} from "@material-tailwind/react";

import { createInvoiceMaping } from "@/constant/modal";
import Head from "next/head";
import dayjs from "dayjs";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { Prisma, type KHACHHANG } from "@prisma/client";
import { moneyFormat } from "@/utils/moneyFormat";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
const TABLE_HEAD = ["Tên khách hàng", "Địa chỉ", "Email", "Số điện thoại"];

const ThuTien: NextPageWithLayout = () => {
  const { data: KhachHang, isLoading: isLoadingKH } =
    api.invoice.getKhachHang.useQuery();

  const locale = "vi";
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
  const {
    mutate: createPTFunc,
    status: createPTStatus,
    reset,
  } = api.invoice.createPhieuThuTien.useMutation({
    onSuccess() {
      updateDebitFunc({
        MaKH: selectKH.MaKH,
        NewDebit: debit,
      });
      executeAfter500ms(async () => {
        clearAll();
        await utils.invoice.getKhachHang.refetch();
      });
    },
    onError(err) {
      console.error(err);
    },
  });
  const status = createPTStatus;
  return (
    <>
      <Head>
        <title>Phiếu Thu Tiền</title>
      </Head>
      <div>
        <div className="mb-8 mt-12 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="blue" className="mb-2 p-6">
              <Typography variant="h6" color="white">
                Phiếu Thu Tiền
              </Typography>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pb-2 pt-0">
              <form
                className="w-100 mb-4 ml-8 mt-2 max-w-screen-lg "
                onSubmit={handleSubmit}
              >
                <Typography className="mb-4 font-bold">
                  Thông tin khách hàng
                </Typography>{" "}
                <div className="mb-4 mt-4 flex flex-col gap-6">
                  <div className="flex flex-row">
                    <Select
                      label="Khách hàng (Tên - SĐT): "
                      variant="static"
                      className="max-w-300"
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
                    <Typography className="basis-1/2 font-bold ">
                      Ngày lập phiếu thu:{" "}
                      {dayjs(today).format("ddd, DD/MM/YYYY")}
                    </Typography>
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
                        KhachHang?.find((i) => i.MaKH == selectKH.MaKH)?.TienNo
                      )
                    )}
                  </Typography>
                  <Typography className="basis-1/2">
                    Số tiền thu: {moneyFormat(pay)}
                  </Typography>
                  <Input
                    className="w-10 basis-1/4"
                    label="Số tiền thu"
                    value={pay}
                    onChange={(e) => {
                      setPay(Number(e.target.value || "0"));
                      setDebit(curr - pay);
                      console.log(`debit`, debit);
                      console.log(`curr`, curr);
                      console.log(`pay`, pay);
                    }}
                  />
                  {debit < 0 ? (
                    <Typography>
                      Số tiền thu không được lớn hơn số tiền nợ!{" "}
                    </Typography>
                  ) : (
                    <Typography>Còn lại: {moneyFormat(debit)} </Typography>
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
            <CardFooter>
              <Button>
                {
                  createInvoiceMaping(false)[
                    status as unknown as keyof typeof createInvoiceMaping
                  ]
                }
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};
ThuTien.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default ThuTien;

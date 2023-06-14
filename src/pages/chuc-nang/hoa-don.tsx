import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { api } from "@/utils/api";
import Head from "next/head";
import dayjs from "dayjs";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { useState, useEffect } from "react";

const TABLE_HEAD = ["STT", "Sách", "Đơn giá bán", "Số lượng", "Xóa sách"];

const TABLE_ROWS = [
  {
    TenSach: "Doraemon",
    DonGiaBan: "20.000đ",
    SoLuong: "5",
  },
  {
    TenSach: "Toán cao cấp",
    DonGiaBan: "35.000đ",
    SoLuong: "1",
  },
  {
    TenSach: "Nextjs cực dễ",
    DonGiaBan: "50.000đ",
    SoLuong: "1",
  },
];

const HoaDon: NextPageWithLayout = () => {
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
  const [quantity, setQuantity] = useState(1);

  const [numRows, setNumRow] = useState(0);

  const [selecting, setSelect] = useState();
  const [MaKH, setMaKH] = useState("");
  const [orderRows, setOrderRow] = useState([]);

  useEffect(() => {}, [numRows]);

  const handleDeleteRow = () => {};

  const handleAddBook = () => {};

  const { data: KhachHang, isLoading: isLoadingKH } =
    api.invoice.getKhachHang.useQuery();
  return (
    <>
      <Head>
        <title>Hóa Đơn Bán Sách</title>
      </Head>
      <div>
        <div className="mb-8 mt-12 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="blue" className="mb-2 p-6">
              <Typography variant="h6" color="white">
                Hóa đơn bán sách
              </Typography>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pb-2 pt-4">
              <form className="m-4">
                <div className="flex w-full flex-row items-center justify-between ">
                  <div className="md:w-56">
                    <Select
                      label="SĐT khách hàng: "
                      disabled={false}
                      variant="static"
                      className="max-w-64"
                    >
                      {isLoadingKH ? (
                        <Option key={MaKH} value={MaKH.toString()}>
                          Đang tải...
                        </Option>
                      ) : KhachHang && KhachHang.length > 0 ? (
                        KhachHang.map(({ MaKH, SoDienThoai }) => (
                          <Option key={MaKH} value={MaKH.toString()}>
                            {SoDienThoai}
                          </Option>
                        ))
                      ) : (
                        <Option key={MaKH} value={MaKH.toString()}>
                          Không có dữ liệu
                        </Option>
                      )}
                    </Select>
                  </div>

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
                      className="basis-1/4"
                      value={"error"}
                      onChange={(e) => {
                        setSelect(selecting);
                      }}
                    >
                      <Option>Doraemon</Option>
                      <Option>2</Option>
                      <Option>3</Option>
                      <Option>4</Option>
                    </Select>
                  </div>
                  <div className=" flex flex-row justify-center items-center gap-2">
                    <Typography className="">
                      Số lượng: {quantity}
                    </Typography>
                    <div className="flex flex-col justify-center items-center">
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={(e) => {
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
                        onClick={(e) => {
                          setQuantity(quantity - 1);
                        }}
                      >
                        <ChevronDownIcon
                          strokeWidth={3}
                          className="h-6 w-6 text-blue-gray-500"
                        />
                      </IconButton>
                    </div>
                    <Button
                      className="w-15 align-content-center h-10"
                      onClick={handleAddBook}
                    >
                      Thêm sách
                    </Button>
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
                    <tbody>
                      {TABLE_ROWS.map(
                        ({ TenSach, DonGiaBan, SoLuong }, index) => (
                          <tr key={TenSach} className="even:bg-blue-gray-50/50">
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
                                {TenSach}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {DonGiaBan}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {SoLuong}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                as="button"
                                href="#"
                                onClick={handleDeleteRow}
                                variant="small"
                                color="blue"
                                className="font-medium"
                              >
                                Xóa
                              </Typography>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  <div>
                    {" "}
                    <Typography>Tổng tiền: </Typography>
                    <div className="flex flex-row">
                      {" "}
                      <Typography className="basis-1/2">
                        Số tiền trả:{" "}
                      </Typography>
                      <Input
                        className="w-10 basis-1/4"
                        label="Số tiền trả"
                      ></Input>
                    </div>
                    <Typography>Còn lại: </Typography>
                  </div>
                </div>
                <div className=" flex justify-end space-x-2">
                  <Button type="submit" className="mt-2">
                    Lập và in hóa đơn
                  </Button>
                  <Button className="mt-2">Thêm khách hàng</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
HoaDon.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default HoaDon;

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

import Head from "next/head";
import dayjs from "dayjs";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { useState, useEffect } from "react";

const TABLE_HEAD = ["STT", "Sách", "Đơn giá bán", "Số lượng", "Xóa sách"];

const TABLE_ROWS = [
  {
    TenSach: "John Michael",
    DonGiaBan: "Manager",
    SoLuong: "23/04/18",
  },
  {
    TenSach: "Alexa Liras",
    DonGiaBan: "Developer",
    SoLuong: "23/04/18",
  },
  {
    TenSach: "Laurent Perrier",
    DonGiaBan: "Executive",
    SoLuong: "19/09/17",
  },
  {
    TenSach: "Michael Levi",
    DonGiaBan: "Developer",
    SoLuong: "24/12/08",
  },
  {
    TenSach: "Richard Gran",
    DonGiaBan: "Manager",
    SoLuong: "04/10/21",
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

  const [numRows, setNumRow] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selecting, setSelect] = useState();
  const [orderRows, setOrderRow] = useState([]);

  useEffect(() => {}, [numRows]);

  const handleDeleteRow = () => {};
  const handleAddBook = () => {};

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

            <CardBody className="overflow-x-scroll px-0 pb-2 pt-0">
              <form className="w-100 mb-4 ml-8 mt-2 max-w-screen-lg ">
                <Typography className="mb-4 font-bold">
                  Thông tin hóa đơn
                </Typography>{" "}
                <div className="flex flex-row">
                  <Select
                    label="SĐT khách hàng: "
                    disabled={false}
                    value="1"
                    variant="static"
                    className="basis-1/4"
                  >
                    <Option>Material Tailwind HTML</Option>
                    <Option>Material Tailwind React</Option>
                    <Option>Material Tailwind Vue</Option>
                    <Option>Material Tailwind Angular</Option>
                    <Option>Material Tailwind Svelte</Option>
                  </Select>
                  <div className="mb-4 ml-2 basis-3/4">
                    <Typography>
                      Ngày lập hóa đơn: {dayjs(today).format("ddd, DD/MM/YYYY")}
                    </Typography>
                  </div>
                </div>
                <Typography className="mb-4 font-bold">
                  Thông tin sách
                </Typography>
                <div className="flex flex-row">
                  <Select
                    label="Chọn sách thêm vào hóa đơn: "
                    variant="static"
                    className="basis-1/4"
                    value={"error"}
                    onChange={(e) => {
                      setSelect(selecting);
                    }}
                  >
                    <Option>1</Option>
                    <Option>2</Option>
                    <Option>3</Option>
                    <Option>4</Option>
                  </Select>
                  <div className=" flex basis-3/4 flex-row justify-center">
                    <Typography className="mt-6">
                      Số lượng: {quantity}
                    </Typography>
                    <div className="flex flex-col justify-center">
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
                      className="w-15 align-content-center mt-5 h-10"
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
                  <Typography>Tổng tiền: </Typography>
                  <Typography>Số tiền trả: </Typography>
                  <Typography>Còn lại: </Typography>
                </div>
                <div className=" flex justify-end space-x-2">
                  <Button type="submit" className="mt-6">
                    Lập và in hóa đơn
                  </Button>
                  <Button className="mt-6">Thêm khách hàng</Button>
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

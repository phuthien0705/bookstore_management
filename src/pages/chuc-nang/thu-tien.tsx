import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
  Input,
  Select,
  Checkbox,
  Option,
  ButtonGroup,
  IconButton,
} from "@material-tailwind/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import { api } from "@/utils/api";
import Head from "next/head";
import dayjs from "dayjs";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { useState, useEffect } from "react";

const TABLE_HEAD = ["Tên Khách hàng", "Địa chỉ", "Email"];

const TABLE_ROWS = [
  {
    TenKhachHang: "John Michael",
    DiaChi: "Ktx Khu A",
    Email: "anhkhoa@gmail.com",
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
              <form className="w-100 mb-4 ml-8 mt-2 max-w-screen-lg ">
                <Typography className="mb-4 font-bold">
                  Thông tin khách hàng
                </Typography>{" "}

                <div className="mb-4 mt-4 flex flex-col gap-6">
                <div className="flex flex-row">
                <Select
                    label="SĐT khách hàng: "
                    disabled={false}
                    value="1"
                    variant="static"
                    className="basis-1/2"
                  >
                    <Option>Material Tailwind HTML</Option>
                    <Option>Material Tailwind React</Option>
                    <Option>Material Tailwind Vue</Option>
                    <Option>Material Tailwind Angular</Option>
                    <Option>Material Tailwind Svelte</Option>
                  </Select>

                    <Typography className="font-bold basis-1/2 ">
                      Ngày lập phiếu thu: {dayjs(today).format("ddd, DD/MM/YYYY")}
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
                      {TABLE_ROWS.map(
                        ({ TenKhachHang, DiaChi, Email }, index) => (
                          <tr key={`${index}_${TenKhachHang}_${Email}`} className="even:bg-blue-gray-50/50">
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {TenKhachHang}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {DiaChi}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {Email}
                              </Typography>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  <Typography>Số tiền nợ: </Typography>
                  <Input label="Số tiền nợ"></Input>
                  <Typography>Số tiền trả: </Typography>
                  <Input label="Số tiền thu"></Input>
                  <Typography>Còn lại: </Typography>
                </div>
                <div className=" flex justify-end space-x-2">
                  <Button type="submit" className="mt-6">
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
HoaDon.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default HoaDon;
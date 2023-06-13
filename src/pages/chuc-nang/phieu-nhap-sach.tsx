import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody, Typography, Input, Select, Option, Button } from "@material-tailwind/react";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";

const BookEntryTicket: NextPageWithLayout = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isTableOpen, setIsTableOpen] = useState(false); // Thêm state để theo dõi trạng thái của bảng sách
  const [tableHeight, setTableHeight] = useState(0);
  const tableRef = useRef(null);

  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Add your logic here to handle form submission
  };

  const TABLE_HEAD = ["ID", "Tên sách", "Thể loại", "Nhà xuất bản", "Năm xuất bản", "Số lượng", "Đơn giá"];
 
const TABLE_ROWS = [
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
  {
    name: "Harry Potter",
    genre: "Huyền bí",
    publisher: "Bloomsbury",
    published_year: "2009/01/02",
    quantity: 1200,
    price: 80000
  },
];

  const toggleTable = () => {
    setIsTableOpen(!isTableOpen); // Thay đổi trạng thái của bảng khi nhấn vào nút "Hiển thị danh sách sách"
  };

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(isTableOpen ? (tableRef.current as HTMLTableElement)?.scrollHeight ?? 0 : 0);
    }
  }, [isTableOpen]);

  return (
    <>
      <Head>
        <title>Phiếu nhập sách</title>
      </Head>
      <div className="mb-8 mt-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Thông tin sách
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-row gap-10">
            <div className="flex flex-col gap-6" style={{width: "100%"}}>
            <Select label="Tên đầu sách">
              <Option>Harry Potter</Option>
              <Option>Điệp viên 007</Option>
            </Select>
              <Input variant="outlined" label="Năm xuất bản"/>
            </div>
            <div className="flex flex-col gap-6" style={{width: "100%"}}>
              <Input variant="outlined" label="Ngày xuất bản"/>
              <Input variant="outlined" label="Số lượng"/>
            </div>
          </CardBody>
        </Card>
        <Card className="mt-10">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Phiếu nhập sách
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            <div className="flex flex-row gap-10" style={{width: "100%"}}>
              <Input variant="outlined" label="Ngày nhập sách" type="date"/>
              <Input variant="outlined" label="Đơn giá nhập"/>
            </div>
            <div className="flex flex-col gap-6" style={{width: "100%"}}>
              <Card 
                className="overflow-hidden" 
                style={{ 
                  maxHeight: tableHeight,
                  transition: isTableOpen ? 'max-height 0.5s ease-in-out' : 'none',
                  overflow: 'hidden'
                }}>
                <table className="w-full min-w-max table-auto text-left" ref={tableRef}>
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
                    {TABLE_ROWS.map(({ name, genre, publisher, published_year, quantity, price }, index) => {
                      const isLast = index === TABLE_ROWS.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
          
                      return (
                        <tr key={name}>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {index + 1}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {name}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {genre}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {publisher}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {published_year}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {quantity}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {price}
                            </Typography>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
            <div className="flex flex-row gap-3 justify-end" style={{width: "100%"}}>
              <Button onClick={toggleTable}>{isTableOpen ? "Ẩn danh sách sách" : "Hiển thị danh sách sách"}</Button>
              <Button>Thêm phiếu</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

BookEntryTicket.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookEntryTicket;

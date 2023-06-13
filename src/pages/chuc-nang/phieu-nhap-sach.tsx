import Head from "next/head";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody, Typography, Input, Select, Option, Button } from "@material-tailwind/react";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { dauSachDinhTuyen } from "@/server/api/routers/dauSach";
import { api } from "@/utils/api";
import { DAUSACH } from "@prisma/client";

const TABLE_HEAD = ["ID", "Tên sách", "Thể loại", "Nhà xuất bản", "Năm xuất bản", "Số lượng", "Đơn giá"];


const BookEntryTicket: NextPageWithLayout = () => {

  const [bookTitle, setBookTitle] = useState<any>();
  const [publisher, setPublisher] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [isTableOpen, setIsTableOpen] = useState(true); // Thêm state để theo dõi trạng thái của bảng sách
  const [tableHeight, setTableHeight] = useState(0);
  const tableRef = useRef(null);
  const [bookList, setBookList] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookSerieList, setBoookSerieList] = useState<DAUSACH[]>([]);
  const [searchValue, setSearchValue] = useState("");
  var temp: DAUSACH[] | null | undefined = null



  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Add your logic here to handle form submission

  };

  const fetchBookSerie = async () => {
    try {
      const { data, isLoading, isFetching } = api.dauSach.getAll.useQuery({});
      setBoookSerieList(data ?? [] as DAUSACH[]); // Ép kiểu data thành DAUSACH[]
      temp = data
    } catch (error) {
      console.error('Error fetching dauSach:', error);
    }
  };
  
  useEffect(() => {
    fetchBookSerie();  // Gọi hàm fetchDauSach khi component được tạo
  }, []);

  const calculateTotalPrice = () => {
    const totalPrice = bookList.reduce(
      (accumulator, book) => accumulator + book.quantity * book.price,
      0
    );
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [bookList]);
  

  const hanldeAddBook = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const newBook = {
      id: bookList.length + 1,
      name: bookTitle,
      genre: "Kinh dị",
      publisher,
      published_year: publishedYear,
      quantity,
      price,
    };
  
    setBookList((prevBookList) => [...prevBookList, newBook]);
  }

  const toggleTable = () => {
    setIsTableOpen(!isTableOpen); // Thay đổi trạng thái của bảng khi nhấn vào nút "Hiển thị danh sách sách"
  };

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(isTableOpen ? (tableRef.current as HTMLTableElement)?.scrollHeight ?? 0 : 0);
    }
  }, [isTableOpen]);

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(isTableOpen ? (tableRef.current as HTMLTableElement)?.scrollHeight ?? 0 : 0);
    }
  }, [isTableOpen, bookList]); 
  
  const handleDeleteBook = (bookId: number) => {
    setBookList((prevBookList) => prevBookList.filter((book) => book.id !== bookId));
  };
  

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
          <CardBody className="flex flex-col gap-6">
            <div className="flex flex-row gap-10">
              <div className="flex flex-col gap-6 w-full">
                <Select 
                  label="Tên đầu sách" 
                  value={searchValue}
                  onChange={(e) => {
                    setBookTitle(e);
                  }}
                >
                  {bookSerieList.map((book) => (
                    <Option key={book.MaDauSach} value={book.TenDauSach}>
                      {book.TenDauSach}
                    </Option>
                  ))}
                </Select>
                <Input variant="outlined" label="Năm xuất bản" onChange={(e) => setPublishedYear(e.target.value)}/>
                <Input variant="outlined" label="Đơn giá nhập" onChange={(e) => setPrice(parseInt(e.target.value))}/>
              </div>
              <div className="flex flex-col gap-6 w-full">
                <Input variant="outlined" label="Nhà xuất bản" onChange={(e) => setPublisher(e.target.value)}/>
                <Input variant="outlined" label="Số lượng" onChange={(e) => setQuantity(e.target.value)}/>
                <div className="flex flex-row gap-10 justify-end">
                  <Button onClick={hanldeAddBook}>Thêm sách</Button>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-row gap-10 justify-end">
              <Button onClick={hanldeAddBook}>Thêm sách</Button>
            </div> */}
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
            <div className="flex flex-row gap-10 w-full">
            <div className="flex-grow">
              <Input variant="outlined" label="Ngày nhập sách" type="date" />
            </div>
            <div className="flex-grow flex items-center">
              <Typography variant="h6" color="blue-gray">
                Tổng tiền: {
                  totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }
                )}
              </Typography>
            </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
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
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"></th> {/* Add new column for delete button */}
                    </tr>
                  </thead>
                  <tbody> 
                    {bookList.map(({ id, name, genre, publisher, published_year, quantity, price }, index) => {
                      const isLast = index === TABLE_HEAD.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                      return (
                        <tr key={id}>
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
                              {price.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND"
                              })}
                            </Typography>
                          </td>
                          <td className={classes}>
                          <Typography
                            variant="small"
                            color="red"
                            className="cursor-pointer"
                            onClick={() => handleDeleteBook(id)} // Add onClick event for delete action
                          >
                            Xóa
                          </Typography>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
            <div className="flex flex-row gap-3 justify-end w-full">
              <Button onClick={toggleTable}>{isTableOpen ? "Ẩn danh sách sách" : "Hiển thị danh sách sách"}</Button>
              <Button onClick={() => console.log(temp)}>Lưu phiếu</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

BookEntryTicket.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookEntryTicket;

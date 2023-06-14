import Head from "next/head";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { api } from "@/utils/api";
import toast from "react-hot-toast";


const BookEntryTicket: NextPageWithLayout = () => {
  const TABLE_HEAD = [
    "ID",
    "Tên sách",
    "Thể loại",
    "Nhà xuất bản",
    "Năm xuất bản",
    "Số lượng",
    "Đơn giá",
  ];

  const [bookTitle, setBookTitle] = useState<any>();
  const [publisher, setPublisher] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [entryDate, setEntryDate] = useState("");
  const [isTableOpen, setIsTableOpen] = useState(true); // Thêm state để theo dõi trạng thái của bảng sách
  const [tableHeight, setTableHeight] = useState(0);
  const tableRef = useRef(null);
  const [bookList, setBookList] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [countCreatedBook, setCountCreatedBook] = useState(0)
  const { data: titles, isLoading: isLoadingTitles } = api.title.getAll.useQuery({});
  const { mutate: createTicket } = api.bookEntryTicket.create.useMutation({
    async onSuccess() {
      toast.success("Lưu phiếu thành công !");
    },
    onError(err) {  
      console.error(err);
    },
  })

  const { mutate: createBook } = api.book.create.useMutation({
    async onSuccess() {
      setCountCreatedBook(countCreatedBook + 1);
    },
    onError(err) {
      console.error(err);
    },
  })
  

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

  const hanldeAddBook = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newBook = {
      id: bookList.length + 1,
      title_id: bookTitle,
      publisher,
      published_year: publishedYear,
      quantity,
      price,
    };

    setBookList((prevBookList) => [...prevBookList, newBook]);
  };

  const toggleTable = () => {
    setIsTableOpen(!isTableOpen); // Thay đổi trạng thái của bảng khi nhấn vào nút "Hiển thị danh sách sách"
  };

  const handleSaveTicket = () => {

    // Tạo mới phiếu nhập
    const entryDateObject = new Date(entryDate);
    if (isNaN(entryDateObject.getTime())) {
      // Xử lý khi đối tượng Date không hợp lệ (ví dụ: hiển thị thông báo lỗi)
      alert("Ngày nhập sách không hợp lệ");
      return;
    }
    const formattedEntryDate = entryDateObject.toISOString(); // "YYYY-MM-DDTHH:mm:ss.sssZ"    

    createTicket({ 
      NgayTao: formattedEntryDate,
      TongTien: totalPrice,
      MaTK: 3,
    });


    // Lưu danh sách sách
    bookList.forEach((book, index) => {
      createBook({
          MaDauSach: parseInt(book.title_id),
          NhaXuatBan: book.publisher,
          NamXuatBan: book.published_year,
          SoLuongTon: book.quantity,
          DonGiaBan: book.price
      })
    })

  }

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(
        isTableOpen
          ? (tableRef.current as HTMLTableElement)?.scrollHeight ?? 0
          : 0
      );
    }
  }, [isTableOpen, bookList]);

  const handleDeleteBook = (bookId: number) => {
    setBookList((prevBookList) =>
      prevBookList.filter((book) => book.id !== bookId)
    );
  };

  const getTitleNameById = (id: number) => {
    const foundTitle = titles?.find((title) => title.MaDauSach === id)
    return foundTitle ? foundTitle.TenDauSach : "";
  }

  const getCategoryNameById = (id: number) => {
    const category = titles?.find((title) => title.MaDauSach === id)
    return category ? category.TheLoai.TenTL : "";
  }

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
              <div className="flex w-full flex-col gap-6">
                <Select
                  label="Tên đầu sách"
                  onChange={(e) => {
                    setBookTitle(e);
                  }}
                >
                  {isLoadingTitles ? (
                    <Option>Đang tải đầu sách ...</Option>
                  ) : titles ? (
                    titles.map((title) => (
                      <Option key={title.MaDauSach} value={title.MaDauSach.toString()}>
                        {title.TenDauSach}
                      </Option>
                    ))
                  ) : (
                    <Option>Không có đầu sách nào</Option>
                  )}
                </Select>
                <Input
                  variant="outlined"
                  label="Năm xuất bản"
                  onChange={(e) => setPublishedYear(e.target.value)}
                />
                <Input
                  variant="outlined"
                  label="Đơn giá nhập"
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                />
              </div>
              <div className="flex w-full flex-col gap-6">
                <Input
                  variant="outlined"
                  label="Nhà xuất bản"
                  onChange={(e) => setPublisher(e.target.value)}
                />
                <Input
                  variant="outlined"
                  label="Số lượng"
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <div className="flex flex-row justify-end gap-10">
                  <Button onClick={hanldeAddBook}>Thêm sách</Button>
                </div>
              </div>
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
            <div className="flex w-full flex-row gap-10">
              <div className="flex-grow">
                <Input 
                  variant="outlined" 
                  label="Ngày nhập sách" 
                  type="date" 
                  onChange={(e) => setEntryDate(e.target.value)}
                />
              </div>
              <div className="flex flex-grow items-center">
                <Typography variant="h6" color="blue-gray">
                  Tổng tiền:{" "}
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Typography>
              </div>
            </div>
            <div className="flex w-full flex-col gap-6">
              <Card
                className="overflow-hidden"
                style={{
                  maxHeight: tableHeight,
                  transition: isTableOpen
                    ? "max-height 0.5s ease-in-out"
                    : "none",
                  overflow: "hidden",
                }}
              >
                <table
                  className="w-full min-w-max table-auto text-left"
                  ref={tableRef}
                >
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
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"></th>{" "}
                      {/* Add new column for delete button */}
                    </tr>
                  </thead>
                  <tbody>
                    {bookList &&
                      bookList?.map(
                        (
                          {
                            id,
                            title_id,
                            category,
                            publisher,
                            published_year,
                            quantity,
                            price,
                          },
                          index
                        ) => {
                          const isLast = index === TABLE_HEAD.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";
                          const titleName = getTitleNameById(parseInt(title_id))
                          const categoryName = getCategoryNameById(parseInt(title_id))
                          return (
                            <tr key={id}>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {index + 1}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {titleName}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {categoryName}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {publisher}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {published_year}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {quantity}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {price.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
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
                        }
                      )}
                  </tbody>
                </table>
              </Card>
            </div>
            <div className="flex w-full flex-row justify-end gap-3">
              <Button onClick={toggleTable}>
                {isTableOpen ? "Ẩn danh sách sách" : "Hiển thị danh sách sách"}
              </Button>
              <Button 
                onClick={() => {
                  handleSaveTicket();
                  toast.success(`Đã thêm ${countCreatedBook} sách mới !`)
               }}>Lưu phiếu
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

BookEntryTicket.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookEntryTicket;

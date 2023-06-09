import useModal from "@/hook/useModal";
import DashboardLayout from "@/layouts/dashboard";
import { api } from "@/utils/api";
import { isStringNumeric } from "@/utils/isStringNumeric";
import { moneyFormat, parseMoneyFormat } from "@/utils/moneyFormat";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Option,
  Select,
  Tab,
  Tabs,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { type NextPageWithLayout } from "../page";

const BookEntryTicketListModal = dynamic(
  () => import("@/components/modals/BookEntryTicketListModal")
);

const TABLE_HEAD = [
  "ID",
  "Tên sách",
  "Thể loại",
  "Nhà xuất bản",
  "Năm xuất bản",
  "Số lượng",
  "Đơn giá",
];
const BookEntryTicket: NextPageWithLayout = () => {
  const router = useRouter();
  const [bookTitle, setBookTitle] = useState<{ id: number; name: string }>({
    id: 0,
    name: "",
  }); // title id
  const [bookId, setBookId] = useState("");
  const [featureTitle, setFeatureTitle] = useState("thêm sách mới");
  const [publisher, setPublisher] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [entryDate, setEntryDate] = useState(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  });
  const { data: references } = api.reference.get.useQuery();
  const [isTableOpen, setIsTableOpen] = useState(true); // Thêm state để theo dõi trạng thái của bảng sách
  const [tableHeight, setTableHeight] = useState(0);
  const tableRef = useRef(null);
  const [bookList, setBookList] = useState<
    {
      NhaXuatBan: string;
      NamXuatBan: string;
      DonGiaBan: number;
      SoLuongTon: number;
      MaDauSach: number;
      MaSach?: number;
    }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addNewTab, setAddNewTab] = useState<boolean>(true);
  const utils = api.useContext();
  const { data: titles, isLoading: isLoadingTitles } =
    api.title.getAll.useQuery({});

  //sách dựa trên đầu sách
  const { data: bookListDueToDauSach } = api.book.getAllByTitleId.useQuery(
    {
      MaDauSach: bookTitle.id,
    },
    {
      enabled: !!bookTitle.id,
    }
  );

  const { data: reference } = api.reference.get.useQuery();
  const { mutateAsync: createTicket } = api.bookEntryTicket.create.useMutation({
    onSuccess() {
      toast.success("Lưu phiếu nhập sách thành công !");
      utils.bookEntryTicket.getAll.refetch();
    },
    onError(err) {
      console.error(err);
      toast.error("Xảy ra lỗi trong quá trình tạo phiếu nhập sách");
    },
  });

  const { mutate: createBookLeftStatistic } =
    api.statistic.createBookLeftStatistic.useMutation();

  const { mutate: updateBookLeftStatistic } =
    api.statistic.updateBookLeftStatistic.useMutation();

  const { data: sessionData } = useSession();
  const {
    open: openBookEntryTicketListModal,
    handleOpen: handleOpenBookEntryTicketListModal,
  } = useModal();

  const handleViewBookEntryTicket = () => {
    handleOpenBookEntryTicketListModal(true); // Mở Modal
  };

  const calculateTotalPrice = useCallback(() => {
    const totalPrice = bookList.reduce(
      (accumulator, book) => accumulator + book.SoLuongTon * book.DonGiaBan,
      0
    );
    setTotalPrice(totalPrice);
  }, [bookList]);

  const hanldeAddBook = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isValidated()) {
      const newBook: {
        NhaXuatBan: string;
        NamXuatBan: string;
        DonGiaBan: number;
        SoLuongTon: number;
        MaDauSach: number;
        MaSach?: number;
      } = {
        MaDauSach: bookTitle.id,
        NhaXuatBan: publisher,
        NamXuatBan: publishedYear,
        SoLuongTon: parseInt(quantity),
        DonGiaBan: parseMoneyFormat(price),
      };

      if (bookId) {
        newBook.MaSach = Number(bookId);
      }
      setBookList((prevBookList) => [...prevBookList, newBook]);
    }
  };

  const toggleTable = () => {
    setIsTableOpen(!isTableOpen);
  };
  function compareDates(entryDate: string): boolean {
    const currentDate = new Date();
    const [year, month, day] = entryDate.split("-");
    const parsedEntryDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
    if (parsedEntryDate > currentDate) {
      return false;
    }
    return true;
  }

  const isValidated = () => {
    const validatedTitle = bookTitle.name !== null;
    const validatedPublisher = publisher !== "";
    const validatedPublisedYear =
      Number(publishedYear) <= new Date().getFullYear() && publishedYear !== "";
    const validatedQuantity =
      Number(quantity) >= Number(reference?.SoLuongNhapToiThieu) &&
      Number(quantity) <= Number(reference?.SoLuongTonToiDa);
    const validatedPrice = Number(price) > 0;

    if (!validatedTitle) {
      toast.error("Không được để trống đầu sách !");
      return false;
    } else if (!validatedPublisher) {
      toast.error("Không được để trống nhà xuất bản !");
      return false;
    } else if (!validatedPublisedYear) {
      toast.error("Năm xuất bản không hợp lệ!");
      return false;
    } else if (!validatedQuantity && references?.SuDungQuyDinh) {
      toast.error("Số lượng nhập không hợp lệ!");
      return false;
    } else if (!validatedPrice) {
      toast.error("Đơn giá nhập lớn hơn 0!");
      return false;
    } else {
      return true;
    }
  };

  const handleSaveTicket = async () => {
    if (!compareDates(entryDate)) {
      toast.error("Ngày nhập sách không hợp lệ!");
      return;
    }
    const [year, month, day] = entryDate.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const dateTimeString = date.toISOString();
    if (sessionData) {
      const response = await createTicket({
        NgayTao: dateTimeString,
        TongTien: totalPrice,
        MaTK: sessionData.user.MaTK,
        DanhSachSach: bookList,
      });

      response.count;

      createBookLeftStatistic({
        month: Number(month),
        year: Number(year),
        bookCount: response.count,
      });

      bookList
        .filter((item) => item.MaSach)
        .forEach((item) => {
          updateBookLeftStatistic({
            maSach: item?.MaSach as number,
            month: Number(month),
            year: Number(year),
            increaseQuantity: item.SoLuongTon,
            decreaseQuantity: 0,
          });
        });
    } else {
      toast.error("Đăng nhập để thực hiện thao tác tạo sách");
      await router.push({
        pathname: "/",
      });
    }
  };

  const handleDeleteBook = (bookIndex: number) => {
    setBookList((prevBookList) =>
      prevBookList.filter((book, index) => index !== bookIndex)
    );
  };

  const getTitleNameById = (MaDauSach: number) => {
    const foundTitle = titles?.find((title) => title.MaDauSach === MaDauSach);
    return foundTitle ? foundTitle.TenDauSach : "";
  };

  const getCategoryNameById = (MaDauSach: number) => {
    const category = titles?.find((title) => title.MaDauSach === MaDauSach);
    return category ? category.TheLoai.TenTL : "";
  };

  const handleRefresh = () => {
    setBookTitle({ id: 0, name: "" });
    setPublisher("");
    setPublishedYear("");
    setPrice("0");
    setQuantity("0");
    setEntryDate(() => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    });
    setIsTableOpen(true);
    setTableHeight(0);
    setBookList([]);
    setTotalPrice(0);
  };

  useEffect(() => {
    if (tableRef.current) {
      setTableHeight(
        isTableOpen
          ? (tableRef.current as HTMLTableElement)?.scrollHeight ?? 0
          : 0
      );
    }
  }, [isTableOpen, bookList]);

  useEffect(() => {
    calculateTotalPrice();
  }, [bookList, calculateTotalPrice]);

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
            <div className="grid w-full grid-cols-2 gap-10">
              <Select
                label="Tên đầu sách"
                onChange={(e) => {
                  setBookTitle({
                    id: parseInt(e as string),
                    name:
                      titles?.find((i) => i.MaDauSach === parseInt(e as string))
                        ?.TenDauSach ?? "",
                  });
                }}
              >
                {isLoadingTitles ? (
                  <Option>Đang tải đầu sách ...</Option>
                ) : titles ? (
                  titles.map((title) => (
                    <Option
                      key={title.MaDauSach}
                      value={title.MaDauSach.toString()}
                    >
                      {title.TenDauSach}
                    </Option>
                  ))
                ) : (
                  <Option>Không có đầu sách nào</Option>
                )}
              </Select>

              <Select
                label="Mã sách"
                disabled={addNewTab}
                onChange={(e) => {
                  setBookId(e as string);
                  setPublisher(
                    bookListDueToDauSach?.find(
                      (item) => item.MaSach == Number(e as string)
                    )?.NhaXuatBan || ""
                  );
                  setPublishedYear(
                    bookListDueToDauSach?.find(
                      (item) => item.MaSach == Number(e as string)
                    )?.NamXuatBan || ""
                  );
                  setPrice(
                    bookListDueToDauSach
                      ?.find((item) => item.MaSach == Number(e as string))
                      ?.DonGiaBan.toString() || ""
                  );
                }}
              >
                {false ? (
                  <Option>Đang tải mã sách ...</Option>
                ) : bookListDueToDauSach ? (
                  bookListDueToDauSach.map((book) => (
                    <Option key={book.MaSach} value={book.MaSach.toString()}>
                      {book.MaSach} ({book.NamXuatBan}, {book.NhaXuatBan},{" "}
                      {moneyFormat(Number(book.DonGiaBan))}đ) - SL:{" "}
                      {book.SoLuongTon}
                    </Option>
                  ))
                ) : (
                  <Option>Không có mã sách nào phù hợp</Option>
                )}
              </Select>

              <Input
                value={publishedYear}
                variant="outlined"
                disabled={!addNewTab}
                label="Năm xuất bản"
                onChange={(e) => {
                  if (!isStringNumeric(e.target.value)) return;
                  setPublishedYear(e.target.value);
                }}
              />
              <Input
                variant="outlined"
                label="Đơn giá nhập (VNĐ)"
                disabled={!addNewTab}
                value={price}
                onChange={(e) => {
                  if (e.target.value.includes("-")) return;
                  setPrice(moneyFormat(parseMoneyFormat(e.target.value)));
                }}
              />
              <Input
                value={publisher}
                variant="outlined"
                disabled={!addNewTab}
                label="Nhà xuất bản"
                onChange={(e) => setPublisher(e.target.value)}
              />
              <Input
                value={quantity}
                variant="outlined"
                label={`Số lượng ${addNewTab ? "" : " nhập thêm"}`}
                onChange={(e) => {
                  if (e.target.value.includes("-")) return;
                  setQuantity(e.target.value);
                }}
              />
              <div></div>
              <div className="flex flex-row justify-end gap-3 self-end">
                <Tabs value="1">
                  <TabsHeader>
                    <Tab
                      value={"1"}
                      className={`mr-1 whitespace-nowrap ${
                        addNewTab ? "text-blue-500" : ""
                      }`}
                      onClick={() => {
                        setAddNewTab(true);
                      }}
                    >
                      Thêm sách mới
                    </Tab>
                    <Tab
                      value={"2"}
                      className={`ml-1 whitespace-nowrap ${
                        !addNewTab ? "text-blue-500" : ""
                      }`}
                      onClick={() => {
                        setAddNewTab(false);
                      }}
                    >
                      Thêm sách đã có
                    </Tab>
                  </TabsHeader>
                </Tabs>
                <Button onClick={hanldeAddBook}>Thêm vào phiếu</Button>
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
            <Button
              variant="outlined"
              className="bg-white"
              onClick={handleViewBookEntryTicket}
            >
              Xem phiếu nhập sách
            </Button>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            <div className="flex w-full flex-row gap-10">
              <div className="flex-grow">
                <Input
                  disabled
                  variant="outlined"
                  label="Ngày nhập sách"
                  type="date"
                  value={entryDate}
                  onChange={(e) => {
                    setEntryDate(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-grow items-center">
                <Typography variant="h6" color="blue-gray">
                  Tổng tiền: {moneyFormat(totalPrice)} VNĐ
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
                            MaDauSach,
                            NhaXuatBan,
                            NamXuatBan,
                            SoLuongTon,
                            DonGiaBan,
                          },
                          index
                        ) => {
                          const isLast = index === TABLE_HEAD.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";
                          const TenDauSach = getTitleNameById(MaDauSach);
                          const TenTL = getCategoryNameById(MaDauSach);
                          return (
                            <tr key={index}>
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
                                  {TenDauSach}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {TenTL}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {NhaXuatBan}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {NamXuatBan}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {SoLuongTon}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {moneyFormat(DonGiaBan)} VNĐ
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="red"
                                  className="cursor-pointer"
                                  onClick={() => handleDeleteBook(index)} // Add onClick event for delete action
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
              <Button
                variant="outlined"
                className="flex items-center gap-3"
                onClick={handleRefresh}
              >
                Làm mới
                <ArrowPathIcon strokeWidth={2} className="h-5 w-5" />
              </Button>
              <Button variant="outlined" onClick={toggleTable}>
                {isTableOpen ? "Ẩn danh sách sách" : "Hiển thị danh sách sách"}
              </Button>
              <Button
                onClick={handleSaveTicket}
                disabled={bookList.length === 0}
              >
                Lưu phiếu
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      <BookEntryTicketListModal
        open={openBookEntryTicketListModal}
        handleOpen={handleOpenBookEntryTicketListModal}
      />
    </>
  );
};

BookEntryTicket.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookEntryTicket;

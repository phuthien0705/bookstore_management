import { contentMapping } from "@/constant/modal";
import { api } from "@/utils/api";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemSuffix,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { type CT_TACGIA, type DAUSACH } from "@prisma/client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";

interface ITitleModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem:
    | (DAUSACH & {
        CT_TACGIA: CT_TACGIA[];
      })
    | null;
  setCurrentItem: Dispatch<
    SetStateAction<
      | (DAUSACH & {
          CT_TACGIA: CT_TACGIA[];
        })
      | null
    >
  >;
}

const TitleModal: React.FC<ITitleModal> = ({
  open,
  handleOpen,
  currentItem,
  setCurrentItem,
}) => {
  const [value, setValue] = useState<
    DAUSACH & {
      CT_TACGIA: CT_TACGIA[];
    }
  >({
    MaDauSach: 0,
    MaTL: 0,
    TenDauSach: "",
    CT_TACGIA: [],
  });
  const utils = api.useContext();
  const { data: categoryData, isLoading: isLoadingCategory } =
    api.category.getAll.useQuery();
  const { data: authorData, isLoading: isLoadingAuthor } =
    api.author.getAll.useQuery();
  const { data: titles } = api.title.getAll.useQuery();
  const clearValueAfterClose = () => {
    setValue({ MaDauSach: 0, MaTL: 0, TenDauSach: "", CT_TACGIA: [] });
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget;
    setValue((p) => ({ ...p, [name]: value }));
  };
  const [authorSelectValue] = useState("");
  const {
    mutate: createFunc,
    status: createStatus,
    reset,
  } = api.title.create.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        await utils.title.getWithPagination.refetch();
        await utils.author.getAll.refetch();
        clearValueAfterClose();
        handleOpen();
      });
    },
    onError(err) {
      console.error(err);
      handleOpen();
    },
  });
  const { mutate: updateFunc, status: updateStatus } =
    api.title.update.useMutation({
      onSuccess() {
        executeAfter500ms(async () => {
          await utils.title.getWithPagination.refetch();
          await utils.author.getAll.refetch();
          clearValueAfterClose();
          setCurrentItem(null);
          handleOpen();
        });
      },
      onError(err) {
        console.error(err);
        handleOpen();
      },
    });

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (
      currentItem &&
      titles &&
      titles
        .filter((i) => i.MaDauSach !== currentItem.MaDauSach)
        .find((i) => i.TenDauSach === value.TenDauSach)
    ) {
      toast.error(
        `Tồn tại đầu sách ${value.TenDauSach}, vui lòng chọn tên khác.`
      );
      return;
    }
    if (currentItem) {
      updateFunc({
        MaDauSach: currentItem.MaDauSach,
        TenDauSach: value.TenDauSach,
        MaTL: value.MaTL,
        TacGia: value.CT_TACGIA.map((i) => i.MaTG),
      });
      return;
    }
    if (titles && titles.find((i) => i.TenDauSach === value.TenDauSach)) {
      toast.error(
        `Tồn tại đầu sách ${value.TenDauSach}, vui lòng chọn tên khác.`
      );
      return;
    }
    createFunc({
      TenDauSach: value.TenDauSach,
      MaTL: value.MaTL,
      TacGia: value.CT_TACGIA.map((i) => i.MaTG),
    });
  };

  const status = currentItem ? updateStatus : createStatus;

  useEffect(() => {
    if (currentItem) {
      setValue({ ...currentItem });
    } else {
      setValue({ MaDauSach: 0, MaTL: 0, TenDauSach: "", CT_TACGIA: [] });
    }
  }, [currentItem]);

  useEffect(() => {
    open && reset();
  }, [open, reset]);

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <form onSubmit={onSubmit}>
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography className="font-bold">
              {currentItem ? "Cập nhật" : "Tạo"} đầu sách
            </Typography>
            <Input
              label="Tên đầu sách"
              size="lg"
              name="TenDauSach"
              value={value.TenDauSach}
              onChange={onChange}
              required
            />

            <Select
              label="Thể loại"
              disabled={isLoadingCategory}
              value={(value.MaTL as number | null)?.toString()}
              onChange={(e) => {
                setValue((p) => ({ ...p, MaTL: parseInt(e as string) }));
              }}
            >
              {categoryData &&
                categoryData.map((item) => (
                  <Option key={item.MaTL} value={item.MaTL.toString()}>
                    {item.TenTL}
                  </Option>
                ))}
            </Select>
            <div className="mt-2">
              <Select
                variant="static"
                label="Chọn tác giả"
                disabled={isLoadingAuthor}
                value={authorSelectValue}
                onChange={(e) => {
                  const temp = value.CT_TACGIA.find(
                    (i) => i.MaTG === parseInt(e as string)
                  );
                  if (temp) {
                    const newArr = value.CT_TACGIA.filter(
                      (obj) => obj.MaTG !== temp.MaTG
                    );
                    setValue((p) => ({ ...p, CT_TACGIA: newArr }));
                  } else {
                    setValue((p) => ({
                      ...p,
                      CT_TACGIA: [
                        ...p.CT_TACGIA,
                        {
                          MaDauSach: value.MaDauSach,
                          MaTG: parseInt(e as string),
                        },
                      ],
                    }));
                  }
                }}
                // multiple
              >
                {authorData &&
                  authorData.map((item) => (
                    <Option key={item.MaTG} value={item.MaTG.toString()}>
                      {item.TenTG}
                    </Option>
                  ))}
              </Select>
              {value.CT_TACGIA.length === 0 ? (
                <Typography className="mt-2 text-sm font-medium">
                  Chưa có tác giả
                </Typography>
              ) : (
                <List className="mt-2 p-0">
                  {value.CT_TACGIA.map((item, index) => {
                    return (
                      <ListItem key={index} className="p-2">
                        {authorData?.find((i) => i.MaTG === item.MaTG)?.TenTG}
                        <ListItemSuffix>
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => {
                              const newArr = value.CT_TACGIA.filter(
                                (obj) => obj.MaTG !== item.MaTG
                              );
                              setValue((p) => ({ ...p, CT_TACGIA: newArr }));
                            }}
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </IconButton>
                        </ListItemSuffix>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" type="submit" fullWidth>
              {
                contentMapping(!!currentItem)[
                  status as unknown as keyof typeof contentMapping
                ]
              }
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
};

export default TitleModal;

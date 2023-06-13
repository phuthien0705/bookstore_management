import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  Card,
  Typography,
  CardBody,
  Input,
  CardFooter,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { type DAUSACH } from "@prisma/client";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { api } from "@/utils/api";
import { contentMapping } from "@/constant/modal";

interface ITitleModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem: DAUSACH | null;
  setCurrentItem: Dispatch<SetStateAction<DAUSACH | null>>;
}

const TitleModal: React.FC<ITitleModal> = ({
  open,
  handleOpen,
  currentItem,
  setCurrentItem,
}) => {
  const [value, setValue] = useState({ MaDauSach: 0, MaTL: 0, TenDauSach: "" });
  const utils = api.useContext();
  const { data: categoryData, isLoading: isLoadingCategory } =
    api.category.getAll.useQuery();
  const clearValueAfterClose = () => {
    setValue({ MaDauSach: 0, MaTL: 0, TenDauSach: "" });
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget;
    setValue((p) => ({ ...p, [name]: value }));
  };
  const {
    mutate: createFunc,
    status: createStatus,
    reset,
  } = api.title.create.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        handleOpen();

        clearValueAfterClose();
        await utils.title.getWithPagination.refetch();
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
          handleOpen();
          clearValueAfterClose();
          setCurrentItem(null);
          await utils.title.getWithPagination.refetch();
        });
      },
      onError(err) {
        console.error(err);
        handleOpen();
      },
    });

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    currentItem
      ? updateFunc({
          MaDauSach: currentItem.MaDauSach,
          TenDauSach: value.TenDauSach,
          MaTL: value.MaTL,
        })
      : createFunc({ TenDauSach: value.TenDauSach, MaTL: value.MaTL });
  };

  const status = currentItem ? updateStatus : createStatus;

  useEffect(() => {
    if (currentItem) {
      setValue({ ...currentItem });
    } else {
      setValue({ MaDauSach: 0, MaTL: 0, TenDauSach: "" });
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

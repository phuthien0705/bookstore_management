import { contentMapping } from "@/constant/modal";
import { api } from "@/utils/api";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";
import { type THELOAI } from "@prisma/client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";

interface ICategoryModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem: THELOAI | null;
  setCurrentItem: Dispatch<SetStateAction<THELOAI | null>>;
}

const CategoryModal: React.FC<ICategoryModal> = ({
  open,
  handleOpen,
  currentItem,
  setCurrentItem,
}) => {
  const [value, setValue] = useState("");
  const utils = api.useContext();
  const clearValueAfterClose = () => {
    setValue("");
  };
  const { data: categorys, isLoading: isLoadingCategorys } =
    api.category.getAll.useQuery();
  const {
    mutate: createFunc,
    status: createStatus,
    reset,
  } = api.category.create.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        handleOpen();
        clearValueAfterClose();
        await utils.category.getWithPagination.refetch();
      });
    },
    onError(err) {
      console.error(err);
      handleOpen();
    },
  });
  const { mutate: updateFunc, status: updateStatus } =
    api.category.update.useMutation({
      onSuccess() {
        executeAfter500ms(async () => {
          handleOpen();
          clearValueAfterClose();
          setCurrentItem(null);
          await utils.category.getWithPagination.refetch();
        });
      },
      onError(err) {
        console.error(err);
        handleOpen();
      },
    });
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    setValue(value);
  };
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (
      currentItem &&
      categorys &&
      categorys
        .filter((i) => i.MaTL !== currentItem.MaTL)
        .find((i) => i.TenTL === value)
    ) {
      toast.error(`Tồn tại thể loại ${value}, vui lòng chọn tên khác.`);
      return;
    }
    if (currentItem) {
      updateFunc({ MaTL: currentItem.MaTL, TenTL: value });
      return;
    }
    if (categorys && categorys.find((i) => i.TenTL === value)) {
      toast.error(`Tồn tại thể loại ${value}, vui lòng chọn tên khác.`);
      return;
    }
    createFunc({ TenTL: value });
  };

  const status = currentItem ? updateStatus : createStatus;

  useEffect(() => {
    if (currentItem) {
      setValue(currentItem.TenTL);
    } else {
      setValue("");
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
              {currentItem ? "Cập nhật" : "Tạo"} thể loại
            </Typography>
            <Input
              label="Tên thể loại"
              size="lg"
              value={value}
              onChange={onChange}
              required
            />
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

export default CategoryModal;

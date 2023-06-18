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
import { type TACGIA } from "@prisma/client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-hot-toast";

interface IAuthorModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem: TACGIA | null;
  setCurrentItem: Dispatch<SetStateAction<TACGIA | null>>;
}

const AuthorModal: React.FC<IAuthorModal> = ({
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
  const { data: authors } = api.author.getAll.useQuery();
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    setValue(value);
  };
  const {
    mutate: createFunc,
    status: createStatus,
    reset,
  } = api.author.create.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        handleOpen();

        clearValueAfterClose();
        await utils.author.getWithPagination.refetch();
      });
    },
    onError(err) {
      console.error(err);
      handleOpen();
    },
  });
  const { mutate: updateFunc, status: updateStatus } =
    api.author.update.useMutation({
      onSuccess() {
        executeAfter500ms(async () => {
          handleOpen();
          clearValueAfterClose();
          setCurrentItem(null);
          await utils.author.getWithPagination.refetch();
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
      authors &&
      authors
        .filter((i) => i.MaTG !== currentItem.MaTG)
        .find((i) => i.TenTG === value)
    ) {
      toast.error(`Tồn tại tác giả ${value}, vui lòng chọn tên khác`);
      return;
    }
    if (currentItem) {
      updateFunc({ MaTG: currentItem.MaTG, TenTG: value });
      return;
    }
    if (authors && authors.find((i) => i.TenTG === value)) {
      toast.error(`Tồn tại tác giả ${value}, vui lòng chọn tên khác`);
      return;
    }
    createFunc({ TenTG: value });
  };

  const status = currentItem ? updateStatus : createStatus;

  useEffect(() => {
    if (currentItem) {
      setValue(currentItem.TenTG);
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
              {currentItem ? "Cập nhật" : "Tạo"} tác giả
            </Typography>
            <Input
              label="Tên tác giả"
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

export default AuthorModal;

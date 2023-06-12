import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  Card,
  Typography,
  CardBody,
  Input,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { api } from "@/utils/api";
import { type THELOAI } from "@prisma/client";
import { contentMapping } from "@/constant/modal";

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
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    setValue(value);
  };
  const {
    mutate: createFunc,
    status: createStatus,
    reset,
  } = api.theLoai.create.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        handleOpen();

        clearValueAfterClose();
        await utils.theLoai.getWithPagination.refetch();
      });
    },
    onError(err) {
      console.error(err);
      handleOpen();
    },
  });
  const { mutate: updateFunc, status: updateStatus } =
    api.theLoai.update.useMutation({
      onSuccess() {
        executeAfter500ms(async () => {
          handleOpen();
          clearValueAfterClose();
          setCurrentItem(null);
          await utils.theLoai.getWithPagination.refetch();
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
      ? updateFunc({ MaTL: currentItem.MaTL, TenTL: value })
      : createFunc({ TenTL: value });
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
              {currentItem ? "Update" : "Create"} Category
            </Typography>
            <Input
              label="Name"
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

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
import { type Category } from "@prisma/client";
import { contentMapping } from "@/constant/modal";

interface ICategoryModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem: Category | null;
  setCurrentItem: Dispatch<SetStateAction<Category | null>>;
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

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    currentItem
      ? updateFunc({ id: currentItem.id, name: value })
      : createFunc({ name: value });
  };

  const status = currentItem ? updateStatus : createStatus;

  useEffect(() => {
    if (currentItem) {
      setValue(currentItem.name);
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
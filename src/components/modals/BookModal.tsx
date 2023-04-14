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
import { type Book } from "@prisma/client";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { api } from "@/utils/api";
import { contentMapping } from "@/constant/modal";

interface IBookModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem: Book | null;
  setCurrentItem: Dispatch<SetStateAction<Book | null>>;
}

type TValues = Omit<Book, "id">;

const defaultValues: TValues = {
  title: "",
  price: 0,
  quantity: 0,
};

const BookModal: React.FC<IBookModal> = ({
  open,
  handleOpen,
  currentItem,
  setCurrentItem,
}) => {
  const [values, setValues] = useState<TValues>(defaultValues);
  const utils = api.useContext();
  const clearValueAfterClose = () => {
    setValues(defaultValues);
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget;
    setValues((p) => ({ ...p, [name]: value }));
  };
  const {
    mutate: createFunc,
    status: createStatus,
    reset,
  } = api.book.create.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        handleOpen();
        clearValueAfterClose();
        await utils.book.getWithPagination.refetch();
      });
    },
    onError(err) {
      console.error(err);
      handleOpen();
    },
  });
  const { mutate: updateFunc, status: updateStatus } =
    api.book.update.useMutation({
      onSuccess() {
        executeAfter500ms(async () => {
          handleOpen();
          clearValueAfterClose();
          setCurrentItem(null);
          await utils.book.getWithPagination.refetch();
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
      ? updateFunc({ id: currentItem.id, ...values })
      : createFunc({ ...values, authors: [], categorys: [] });
  };

  const status = currentItem ? updateStatus : createStatus;

  useEffect(() => {
    if (currentItem) {
      setValues({
        title: currentItem.title,
        price: currentItem.price,
        quantity: currentItem.quantity,
      });
    } else {
      setValues(defaultValues);
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
              {currentItem ? "Update" : "Create"} book
            </Typography>
            <Input
              label="Title"
              size="lg"
              name="title"
              value={values.title}
              onChange={onChange}
              required
            />
            <Input
              type="number"
              label="Price"
              size="lg"
              name="price"
              value={values.price}
              onChange={onChange}
              required
            />
            <Input
              type="number"
              label="Quantity"
              size="lg"
              name="quantity"
              value={values.quantity}
              onChange={onChange}
              required
            />
            <Select label="Authors">
              <Option>Material Tailwind HTML</Option>
              <Option>Material Tailwind React</Option>
              <Option>Material Tailwind Vue</Option>
              <Option>Material Tailwind Angular</Option>
              <Option>Material Tailwind Svelte</Option>
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

export default BookModal;

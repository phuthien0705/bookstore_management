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
  authorId: 0,
  categoryId: 0,
};

const BookModal: React.FC<IBookModal> = ({
  open,
  handleOpen,
  currentItem,
  setCurrentItem,
}) => {
  const [values, setValues] = useState<TValues>(defaultValues);
  const utils = api.useContext();
  const { data: authors, isLoading: isAuthorsLoading } =
    api.author.getAll.useQuery();
  const { data: categorys, isLoading: isCategorysLoading } =
    api.category.getAll.useQuery();
  const clearValueAfterClose = () => {
    setValues(defaultValues);
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value, name, type } = e.currentTarget;
    if (type === "number")
      setValues((p) => ({ ...p, [name]: parseInt(value) }));
    else setValues((p) => ({ ...p, [name]: value }));
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
      : createFunc({ ...values });
  };

  const status = currentItem ? updateStatus : createStatus;

  useEffect(() => {
    if (currentItem) {
      const { id, ...itemInfo } = currentItem;
      setValues({
        ...itemInfo,
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
            <Select
              label="Author"
              disabled={isAuthorsLoading}
              value={(values.authorId as number | null)?.toString()}
              onChange={(e) => {
                setValues((p) => ({ ...p, authorId: parseInt(e as string) }));
              }}
            >
              {authors &&
                authors.map((item) => (
                  <Option key={item.id} value={item.id.toString()}>
                    {item.name}
                  </Option>
                ))}
            </Select>
            <Select
              label="Category"
              disabled={isCategorysLoading}
              value={(values.categoryId as number | null)?.toString()}
              onChange={(e) => {
                setValues((p) => ({ ...p, categoryId: parseInt(e as string) }));
              }}
            >
              {categorys &&
                categorys.map((item) => (
                  <Option key={item.id} value={item.id.toString()}>
                    {item.name}
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

export default BookModal;

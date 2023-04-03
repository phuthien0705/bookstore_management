import {
  Dialog,
  Card,
  Typography,
  CardBody,
  Input,
  CardFooter,
  Button,
} from "@material-tailwind/react";

interface IAuthor {
  open: boolean;
  handleOpen: (value: any) => void;
}

export const AuthorModal: React.FC<IAuthor> = ({ open, handleOpen }) => {
  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[24rem]">
        <CardBody className="flex flex-col gap-4">
          <Typography className="font-bold">Create Author</Typography>
          <Input label="Name" size="lg" />
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" onClick={handleOpen} fullWidth>
            create
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
};

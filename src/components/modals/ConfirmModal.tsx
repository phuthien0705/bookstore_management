import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  DialogFooter,
} from "@material-tailwind/react";

interface IConfirmModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  cb?: Function;
  title?: string;
  content?: string;
}

const ConfirmModal: React.FC<IConfirmModal> = ({
  open,
  handleOpen,
  title = "",
  content = "",
  cb,
}) => {
  return (
    <Dialog open={open} size={"sm"} handler={handleOpen}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider>{content}</DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="gray"
          onClick={() => handleOpen()}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button
          variant="gradient"
          color="red"
          onClick={() => {
            cb && cb();
            handleOpen();
          }}
        >
          <span>Delete</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmModal;

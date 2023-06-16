import { api } from "@/utils/api";
import { isStringNumeric } from "@/utils/isStringNumeric";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface IAddCustomerModal {
  open: boolean;
  handleOpen: () => void;
}

const AddCustomerModal = ({ open, handleOpen }: IAddCustomerModal) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  const utils = api.useContext();

  const { mutate } = api.customer.createKhachHang.useMutation({
    onSuccess() {
      utils.customer.getKhachHang.refetch();
      utils.customer.getWithPagination.refetch();
      toast.success("Tạo khách hàng thành công");
      handleOpen();
    },
    onError() {
      toast.error("Có lỗi xảy ra.");
    },
  });

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Tạo khách hàng.</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-4">
          <div>
            <Input
              required
              label="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-[250px]"
            />
          </div>
          <div>
            <Input
              label="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-[250px]"
            />
          </div>
          <div>
            <Input
              label="Số điện thoại"
              required
              value={number}
              type="tel"
              onChange={(e) =>
                {
                  if (!isStringNumeric(e.target.value)) return;
                  setNumber(e.target.value)}
                }
              className="w-[250px]"
            />
          </div>
          <div>
            <Input
              required
              label="Email"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-[250px]"
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={handleOpen} className="mr-1">
          <span>Huỷ</span>
        </Button>
        <Button
          disabled={!name || !number || !email}
          variant="gradient"
          color="blue"
          onClick={() => {
            mutate({
              HoTen: name,
              DiaChi: address,
              SoDienThoai: number,
              Email: email,
            });
          }}
        >
          <span>Tạo</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddCustomerModal;

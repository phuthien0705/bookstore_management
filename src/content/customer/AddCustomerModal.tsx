import { api } from "@/utils/api";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";

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
    },
  });

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Tạo khách hàng.</DialogHeader>
      <DialogBody divider>
        <div>
          <div>
            <Input
              label="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-[250px]"
            />
          </div>

          <div>
            <Input
              label="Tên"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-[250px]"
            />
          </div>

          <div>
            <Input
              label="Tên"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-[250px]"
            />
          </div>

          <div>
            <Input
              label="Tên"
              value={email}
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

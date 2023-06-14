import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  Card,
  Typography,
  CardBody,
  Input,
  CardFooter,
  Button,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { executeAfter500ms } from "@/utils/executeAfter500ms";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { type TAIKHOAN } from "@prisma/client";
import { contentMapping } from "@/constant/modal";
import { UserRole } from "@/constant/constant";
import { api } from "@/utils/api";

interface IStaffModal {
  open: boolean;
  handleOpen: (value?: boolean) => void;
  currentItem: TAIKHOAN | null;
  setCurrentItem: Dispatch<SetStateAction<TAIKHOAN | null>>;
}

const defaultGroupIdOfStaff = 1;

const StaffModal: React.FC<IStaffModal> = ({
  open,
  handleOpen,
  currentItem,
  setCurrentItem,
}) => {
  const utils = api.useContext();
  const [value, setValue] = useState<TAIKHOAN>({
    MaTK: 0,
    TenDangNhap: "",
    MatKhau: "",
    MaNhom: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const { data: groupUsers, isLoading: isLoadingGroupUsers } =
    api.groupUser.getAll.useQuery();
  const clearValueAfterClose = () => {
    setValue({
      MaTK: 0,
      TenDangNhap: "",
      MatKhau: "",
      MaNhom: 0,
    });
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget;
    setValue((p) => ({ ...p, [name]: value }));
  };
  const {
    mutate: createFunc,
    status: createStatus,
    reset,
  } = api.account.create.useMutation({
    onSuccess() {
      executeAfter500ms(async () => {
        handleOpen();
        clearValueAfterClose();
        await utils.account.getStaffWithPagination.refetch();
      });
    },
    onError(err) {
      console.error(err);
      handleOpen();
    },
  });
  const { mutate: updateFunc, status: updateStatus } =
    api.account.update.useMutation({
      onSuccess() {
        executeAfter500ms(async () => {
          handleOpen();
          clearValueAfterClose();
          setCurrentItem(null);
          await utils.account.getStaffWithPagination.refetch();
        });
      },
      onError(err) {
        console.error(err);
        handleOpen();
      },
    });

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (groupUsers) {
      currentItem
        ? updateFunc({ ...value })
        : createFunc({
            TenDangNhap: value.TenDangNhap,
            MatKhau: value.MatKhau,
            MaNhom:
              groupUsers?.find((gu) => gu.TenNhom === UserRole.staff)?.MaNhom ??
              defaultGroupIdOfStaff,
          });
    }
  };

  const status = currentItem ? updateStatus : createStatus;

  useEffect(() => {
    if (currentItem) {
      setValue({ ...currentItem });
    } else {
      setValue({
        MaTK: 0,
        TenDangNhap: "",
        MatKhau: "",
        MaNhom: 0,
      });
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
              {currentItem ? "Cập nhật" : "Tạo"} tài khoản
            </Typography>
            <Input
              label="Tên đăng nhập"
              size="lg"
              name="TenDangNhap"
              value={value.TenDangNhap}
              onChange={onChange}
              required
            />
            <div className="relative flex w-full max-w-[24rem]">
              <Input
                label="Mật khẩu"
                size="lg"
                type={showPassword ? "text" : "password"}
                name="MatKhau"
                value={value.MatKhau}
                onChange={onChange}
                required
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <div className="!absolute right-1 rounded" style={{ top: "5px" }}>
                <IconButton
                  onClick={() => setShowPassword((p) => !p)}
                  variant="text"
                  color="blue-gray"
                  size="sm"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </IconButton>
              </div>
            </div>
            <div className="flex gap-3">
              <Typography>Vai trò:</Typography>
              <Chip variant="ghost" value="Nhân viên" />
            </div>
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

export default StaffModal;

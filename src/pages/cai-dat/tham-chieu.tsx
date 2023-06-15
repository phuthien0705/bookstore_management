import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
  Typography,
  Button,
} from "@material-tailwind/react";
import { api } from "@/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";

const SettingPage: NextPageWithLayout = () => {
  const { data } = api.reference.get.useQuery();
  const [entryMin, setEntryMin] = useState<number>(150);
  const [leftMax, setLeftMax] = useState<number>(300);
  const [leftAfterSellMin, setLefAfterSellMin] = useState<number>(20);
  const [priceRatio, setPriceRatio] = useState<number>(1.05);
  const [debtMax, setDebtMax] = useState<number>(20000);
  const [apply, setApply] = useState<boolean>(true);
  const { mutate: updateReference } = api.reference.update.useMutation({
    onSuccess(data) {
      toast.success("Đã áp dụng quy đinh !");
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleApplyReference = () => {
    updateReference({
      id: 1,
      SoLuongNhapToiThieu: entryMin,
      SoLuongTonToiDa: leftMax,
      TonKhoToiThieuSauBan: leftAfterSellMin,
      TyLeDonGia: priceRatio,
      CongNoToiDa: debtMax,
      SuDungQuyDinh: apply,
    });
  };

  const setDefaultReference = () => {};

  return (
    <>
      <Head>
        <title>Thay đổi tham chiếu</title>
      </Head>
      <div className="mb-8 mt-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Nhập sách
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-row gap-10">
            <Input
              variant="outlined"
              label="Số lượng nhập tối thiểu"
              defaultValue={data?.SoLuongNhapToiThieu}
              onChange={(e) => setEntryMin(Number(e.target.value))}
            />
            <Input
              variant="outlined"
              label="Số lượng tồn tối thiểu"
              defaultValue={data?.SoLuongTonToiDa}
              onChange={(e) => setLeftMax(Number(e.target.value))}
            />
          </CardBody>
        </Card>
        <Card className="mt-10">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Bán sách
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-row gap-10">
            <div className="flex flex-col gap-6" style={{ width: "100%" }}>
              <Input
                variant="outlined"
                label="Số tiền nợ tối đa"
                defaultValue={data?.CongNoToiDa}
                onChange={(e) => setDebtMax(Number(e.target.value))}
              />
              <Input
                variant="outlined"
                label="Tỷ lệ đơn giá bán"
                defaultValue={data?.TyLeDonGia.toString()}
                onChange={(e) => setPriceRatio(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-6" style={{ width: "100%" }}>
              <Input
                variant="outlined"
                label="Tồn tối thiểu sau bán"
                defaultValue={data?.TonKhoToiThieuSauBan}
                onChange={(e) => setLefAfterSellMin(Number(e.target.value))}
              />
            </div>
          </CardBody>
        </Card>
        <div className="mt-8 flex justify-end">
          <Checkbox
            label={
              <Typography color="blue-gray" className="flex font-medium">
                Sử dụng
                <Typography
                  as="a"
                  href="#"
                  color="blue"
                  className="mr-5 font-medium transition-colors hover:text-blue-700"
                >
                  &nbsp;quy định này.
                </Typography>
              </Typography>
            }
            defaultChecked={data?.SuDungQuyDinh == true}
            onChange={(e) => setApply(e.target.checked)}
          />
          <Button color="gray" className="mr-4" onClick={setDefaultReference}>
            Mặc định
          </Button>
          <Button color="blue" onClick={handleApplyReference}>
            Áp dụng
          </Button>
        </div>
      </div>
    </>
  );
};
SettingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default SettingPage;

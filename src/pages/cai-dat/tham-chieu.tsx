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
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import useValidateUser from "@/hook/useValidateUser";

const SettingPage: NextPageWithLayout = () => {
  const [entryMin, setEntryMin] = useState<number>(150);
  const [leftMax, setLeftMax] = useState<number>(300);
  const [leftAfterSellMin, setLefAfterSellMin] = useState<number>(20);
  const [priceRatio, setPriceRatio] = useState<number>(Number(1.05));
  const [debtMax, setDebtMax] = useState<number>(20000);
  const [apply, setApply] = useState<boolean>(true);

  const { data } = api.reference.get.useQuery(
    {},
    {
      onSuccess(data) {
        console.log(data);
        if (data) {
          setEntryMin(data.SoLuongNhapToiThieu ?? 150);
          setLeftMax(data.SoLuongTonToiDa ?? 300);
          setLefAfterSellMin(data.TonKhoToiThieuSauBan ?? 20);
          setPriceRatio(Number(data.TyLeDonGia) ?? 1.05);
          setDebtMax(data.CongNoToiDa ?? 20000);
          setApply(data.SuDungQuyDinh ?? false);
        }
      },
    }
  );

  const { mutate: updateReference } = api.reference.update.useMutation({
    onSuccess() {
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

  const setDefaultReference = () => {
    setEntryMin(150);
    setLeftMax(300);
    setLefAfterSellMin(20);
    setPriceRatio(1.05);
    setDebtMax(20000);
    setApply(true);
  };
  useValidateUser();
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
              value={entryMin}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value)) {
                  setEntryMin(value);
                }
              }}
            />
            <Input
              variant="outlined"
              label="Số lượng tồn tối đa"
              value={leftMax}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value)) {
                  setLeftMax(value);
                }
              }}
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
                value={debtMax}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    setDebtMax(value);
                  }
                }}
              />
              <Input
                variant="outlined"
                label="Tỷ lệ đơn giá bán"
                value={priceRatio}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    setPriceRatio(value);
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-6" style={{ width: "100%" }}>
              <Input
                variant="outlined"
                label="Tồn tối thiểu sau bán"
                value={leftAfterSellMin}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    setLefAfterSellMin(value);
                  }
                }}
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
            checked={apply}
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

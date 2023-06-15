import useUserDebtState from "@/hook/bao-cao/useUserDebtState";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import MonthYearInputSection from "./MonthYearInputSection";

const TABLE_HEAD = ["STT", "Mã khách hàng", "Nợ đầu", "Phát sinh", "Nợ cuối"];

const UserDebtPanel = () => {
  const { state, data } = useUserDebtState();
  return (
    <div className="mb-8 mt-12 rounded-lg">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-2 px-6 py-4">
          <Typography variant="h6" color="white">
            Báo cáo công nợ của từng khách hàng theo tháng và năm
          </Typography>
        </CardHeader>
        <CardBody className="p-4">
          <MonthYearInputSection {...state} />
          <Card className="h-full w-full">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(({ noCuoi, maKH, noDau, phatSinh }, index) => {
                  return (
                    <tr key={maKH} className="even:bg-blue-gray-50/50">
                      <td className={"border-b border-blue-gray-50 p-4"}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1}
                        </Typography>
                      </td>
                      <td className={"border-b border-blue-gray-50 p-4"}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {maKH}
                        </Typography>
                      </td>
                      <td className={"border-b border-blue-gray-50 p-4"}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {noCuoi}
                        </Typography>
                      </td>
                      <td className={"border-b border-blue-gray-50 p-4"}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {phatSinh}
                        </Typography>
                      </td>
                      <td className={"border-b border-blue-gray-50 p-4"}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {noDau}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserDebtPanel;

import dynamic from "next/dynamic";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { type color } from "@material-tailwind/react/types/components/alert";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IStatisticsChart {
  color: string;
  chart: object;
  title: React.ReactNode;
  description: React.ReactNode;
  footer: React.ReactNode;
}

export function StatisticsChart({
  color = "blue",
  chart,
  title,
  description,
  footer = null,
}: IStatisticsChart) {
  return (
    <Card>
      <CardHeader variant="gradient" color={color as color}>
        <Chart {...chart} />
      </CardHeader>
      <CardBody className="p-6">
        <Typography variant="h6" color="blue-gray">
          {title}
        </Typography>
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {description}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 px-6 py-5">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default StatisticsChart;

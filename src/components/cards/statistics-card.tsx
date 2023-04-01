import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { type color } from "@material-tailwind/react/types/components/alert";
interface IStatisticsCard {
  color: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  value: React.ReactNode;
  footer?: React.ReactNode;
}

export function StatisticsCard({
  color = "blue",
  icon,
  title,
  value,
  footer = null,
}: IStatisticsCard) {
  return (
    <Card>
      <CardHeader
        variant="gradient"
        color={color as color}
        className="absolute -mt-4 grid h-16 w-16 place-items-center"
      >
        {icon}
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 p-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default StatisticsCard;

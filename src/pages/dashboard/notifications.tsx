import React from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { type color } from "@material-tailwind/react/types/components/alert";
import DashboardLayout from "@/layouts/dashboard";

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState<{
    [key: string]: boolean;
  }>({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState<{
    [key: string]: boolean;
  }>({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const alerts = ["blue", "green", "orange", "red"];

  return (
    <DashboardLayout>
      <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
        <Card>
          <CardHeader
            color="transparent"
            floated={false}
            shadow={false}
            className="m-0 p-4"
          >
            <Typography variant="h5" color="blue-gray">
              Alerts
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-4">
            {alerts.map((color) => (
              <Alert
                key={color}
                show={(showAlerts[color] as boolean) ?? false}
                color={color as color}
                dismissible={{
                  onClose: () =>
                    setShowAlerts((current) => ({
                      ...current,
                      [color]: false,
                    })),
                }}
              >
                A simple {color} alert with an <a href="#">example link</a>.
                Give it a click if you like.
              </Alert>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            color="transparent"
            floated={false}
            shadow={false}
            className="m-0 p-4"
          >
            <Typography variant="h5" color="blue-gray">
              Alerts with Icon
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-4">
            {alerts.map((color) => (
              <Alert
                key={color}
                show={showAlertsWithIcon[color]}
                color={color as color}
                icon={
                  <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
                }
                dismissible={{
                  onClose: () =>
                    setShowAlertsWithIcon((current) => ({
                      ...current,
                      [color]: false,
                    })),
                }}
              >
                A simple {color} alert with an <a href="#">example link</a>.
                Give it a click if you like.
              </Alert>
            ))}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;

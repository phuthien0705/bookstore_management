import { Avatar, Typography } from "@material-tailwind/react";
interface IMessageCard {
  img: string;
  name: string;
  message: string;
  action?: React.ReactNode;
}
export function MessageCard({
  img,
  name,
  message,
  action = null,
}: IMessageCard) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar
          src={img}
          alt={name}
          className="shadow-blue-gray-500/25 shadow-lg"
        />
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-1 font-semibold"
          >
            {name}
          </Typography>
          <Typography className="text-blue-gray-400 text-xs font-normal">
            {message}
          </Typography>
        </div>
      </div>
      {action}
    </div>
  );
}

export default MessageCard;

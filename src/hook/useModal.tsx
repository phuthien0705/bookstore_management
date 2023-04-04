import { useState } from "react";

const useModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = (value?: boolean) => {
    if (value) {
      setOpen(value);
    } else {
      setOpen((cur) => !cur);
    }
  };
  return {
    open,
    handleOpen,
  };
};

export default useModal;

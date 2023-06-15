export const moneyFormat = (money: number) => {
  return money.toLocaleString("vi", {
    style: "currency",
    currency: "VND",
  });
};

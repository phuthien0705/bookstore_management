export const moneyFormat = (moneyNumber: number) => {
  if (Number.isNaN(moneyNumber)) return "";
  return moneyNumber.toLocaleString().replaceAll(",", ".");
};

export const parseMoneyFormat = (formattedString: string) => {
  const numberString = formattedString.replaceAll(".", "");
  const parsedNumber = parseInt(numberString);
  return parsedNumber;
};

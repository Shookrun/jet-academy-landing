export const formatDate = (date: Date | string): string => {
  const d = new Date(date);

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);

  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formatDate(d)} ${time}`;
};

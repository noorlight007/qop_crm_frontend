export const cartHeaderData = [
  {
    image: "dashboard-2/2.png",
    title: "Microwave",
    price: 500,
    value: 1,
  },
];

const getTodayDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

export const notificationData = [
  {
    date: getTodayDate(),
    time: "Today",
    dotColor: "primary",
    fontColor: "primary",
    message: "No new notifications yet.",
  },
];

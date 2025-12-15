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
    name: "QOP Dev. Team",
    message:
      "Server maintenance scheduled every Monday from GTM 5:00 AM to 6:00 AM",
  },
  // {
  //   date: "28-06-2024",
  //   time: "1 hour ago",
  //   dotColor: "secondary",
  //   fontColor: "secondary",
  //   name: "Herry Venter",
  //   message: "I am convinced that there can be luxury in simplicity.",
  // },
  // {
  //   date: "04-08-2024",
  //   time: "Today",
  //   dotColor: "primary",
  //   fontColor: "primary",
  //   name: "Loain Deo",
  //   message: "I feel that things happen for open new opportunities.",
  // },
  // {
  //   date: "12-11-2024",
  //   time: "Yesterday",
  //   dotColor: "secondary",
  //   fontColor: "secondary",
  //   name: "Fenter Jessy",
  //   message: "Sometimes the simplest things are the most profound.",
  // },
];

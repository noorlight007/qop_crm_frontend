"use client";
import { FunctionComponent, useEffect, useState } from "react";

const AdminSupportTicketPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (await import("@/Components/Admin/SupportTicket"))
          .default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default AdminSupportTicketPage;

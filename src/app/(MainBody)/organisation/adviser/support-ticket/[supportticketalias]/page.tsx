"use client";
import { FunctionComponent, useEffect, useState } from "react";

const SupportTicketDetailsPage = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/Network/Director/SupportTicket/[SupportTicketAlias]")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default SupportTicketDetailsPage;

"use client";
import { FunctionComponent, useEffect, useState } from "react";

const NetworkAuditLog = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import(
            "@/Components/General/Dashboard/Network/ReportsAndTasks/AuditLog"
          )
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default NetworkAuditLog;

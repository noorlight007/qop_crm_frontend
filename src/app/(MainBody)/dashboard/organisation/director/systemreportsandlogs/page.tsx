"use client";
import { FunctionComponent, useEffect, useState } from "react";

const OrganisationDirectorSystemReportsAndLogs = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import(
            "@/Components/General/Dashboard/Organisation/Director/ReportsAndTasks/SystemReportsAndLogs"
          )
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default OrganisationDirectorSystemReportsAndLogs;

"use client";
import { FunctionComponent, useEffect, useState } from "react";

const OrganisationDirectorReports = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import("@/Components/Organisation/Director/Cases/Reports")
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default OrganisationDirectorReports;

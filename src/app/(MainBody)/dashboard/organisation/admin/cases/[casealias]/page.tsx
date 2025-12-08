"use client";
import { FunctionComponent, useEffect, useState } from "react";

const OrganisationAdminSingleCaseAlias = () => {
  const [MyAwesomeMap, setClient] = useState<FunctionComponent>();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import(
            "@/Components/General/Dashboard/Organisation/Admin/Caseupdates/[CaseAlias]"
          )
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default OrganisationAdminSingleCaseAlias;
